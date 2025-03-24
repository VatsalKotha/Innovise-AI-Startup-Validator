

"use client";
import Cookies from "js-cookie";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Filter, Loader2, MapPin, Search, X } from "lucide-react";
  const url = "https://goo.gl/maps/3X3X3X3X3X3X3X3X3X";

// Mapbox CSS (required for markers and controls)
import "mapbox-gl/dist/mapbox-gl.css";



const Map = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tickerRef = useRef(null);
  const markersRef = useRef([]);
  const [zoom, setZoom] = useState(18);
  const [lng, setLng] = useState(72.837296); // Default longitude
  const [lat, setLat] = useState(19.107093); // Default latitude
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);


  const [investors, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the provided API
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/match_investors`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: Cookies.get("uid"),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result = await response.json();
        setData(result['matched_investors']);
      } catch (err) {

      } finally {

      }
    };

    fetchData();
  }, []);

  // Extract all unique industries for the dropdown
  const allIndustries = Array.from(
    new Set(investors.flatMap((investor) => investor.focus_industry.split(", ")))
  ).sort();

  // Filter investors based on search term and selected industry
  const filteredInvestors = investors.filter((investor) => {
    const matchesSearch = investor.investor_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedService
      ? investor.focus_industry.includes(selectedService)
      : true;
    return matchesSearch && matchesIndustry;
  });
  

  // Function to render investor markers
  const renderInvestorMarkers = () => {
    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  
    // Add new markers for filtered investors
    filteredInvestors.forEach((investor) => {
      if (!investor.latitude || !investor.longitude) {
        console.warn("Skipping investor due to missing coordinates:", investor);
        return;
      }
  
      const el = document.createElement("div");
      el.className = "marker";
      el.style.width = "25px";
      el.style.height = "25px";
      el.style.backgroundColor = "#9A9285";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";
      el.style.border = "2px solid white";
  
      const popup = new mapboxgl.Popup({ offset: 25, maxWidth: 300 }).setHTML(`
        <div class=" p-4 rounded-lg w-64">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">${investor.investor_name}</h3>
      
          <div class="flex items-center gap-2 text-gray-700 text-sm mb-2">
          
            <span class="font-semibold">Focus:</span> ${investor.focus_industry}
          </div>
      
          <div class="flex items-center gap-2 text-gray-700 text-sm mb-4">
           
            <span class="font-semibold">Location:</span> ${investor.location}
          </div>
      
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 p-2 rounded-lg shadow">
              <p class="text-xs text-gray-500 font-semibold">Max Investment</p>
              <p class="text-gray-900 font-bold">$${investor.max_investment.toLocaleString()}</p>
            </div>
            <div class="bg-gray-50 p-2 rounded-lg shadow">
              <p class="text-xs text-gray-500 font-semibold">Confidence</p>
              <p class="text-gray-900 font-bold">${investor.confidence_score}</p>
            </div>
          </div>
        </div>
      `);
      
  
      // Convert lat/lng to numbers in case they're strings
      const lat = Number(investor.latitude);
      const lng = Number(investor.longitude);
  
      // Ensure valid coordinates
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.error("Invalid coordinates:", investor);
        return;
      }
  
      // Create marker and add it to the map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(mapRef.current);
  
      markersRef.current.push(marker);
    });
  };
  

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1Ijoic2FtejI0MDciLCJhIjoiY202d2J1ZGxrMGVodzJxczZtN3FweDBrOSJ9.tTHirquUSgweNqnOlCoeRA";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [lng, lat], // Initial center using default coordinates
      zoom: zoom,
      attributionControl: false,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    mapRef.current.on("move", () => {
      setLng(mapRef.current.getCenter().lng.toFixed(4));
      setLat(mapRef.current.getCenter().lat.toFixed(4));
      setZoom(mapRef.current.getZoom().toFixed(2));
    });

    // Create the user's location marker on the map
    const el = document.createElement("div");
    el.className = "custom-ticker";
    el.innerHTML = `<div class="pulse"></div>`;

    tickerRef.current = new mapboxgl.Marker({ element: el, draggable: true })
      .setLngLat([lng, lat]) // Initial marker position using default coordinates
      .addTo(mapRef.current);

    tickerRef.current.on("dragend", () => {
      const lngLat = tickerRef.current.getLngLat();
      setLng(lngLat.lng.toFixed(4));
      setLat(lngLat.lat.toFixed(4));
    });

    // Initial rendering of investor markers
    mapRef.current.on("load", () => {
      renderInvestorMarkers();
    });

    return () => {
      mapRef.current?.remove(); // Clean up the map on unmount
    };
  }, []);

  // Re-render markers when filters change
  useEffect(() => {
    if (mapRef.current && mapRef.current.loaded()) {
      renderInvestorMarkers();
    }
  }, [searchTerm, selectedService]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedService("");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* User Location Info */}
      {/* <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">User Location</h3>
        </div>
        <p className="text-sm font-medium text-gray-700">
          Longitude: <span className="font-semibold">{lng}</span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Latitude: <span className="font-semibold">{lat}</span>
        </p>
        <p className="text-sm font-medium text-gray-700">
          Zoom: <span className="font-semibold">{zoom}</span>
        </p>
      </div> */}

      {/* Investor Search Filter */}
      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-lg rounded-lg p-4 shadow-lg max-w-sm w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Find Investors
            </h3>
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="text-gray-600 hover:text-blue-500 transition"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search investors by name..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="mb-3 animate-fadeIn">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by industry:
            </label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Industries</option>
                {allIndustries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredInvestors.length} investor
            {filteredInvestors.length !== 1 ? "s" : ""} found
          </div>
          {(searchTerm || selectedService) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
        </div>

        {filteredInvestors.length > 0 && (
          <div className="mt-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {filteredInvestors.map((investor) => (
              <div
                key={investor.investor_name}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer transition"
                onClick={() => {
                  mapRef.current.flyTo({
                    center: [investor.longitude, investor.latitude],
                    zoom: 18,
                    essential: true,
                    duration: 1000,
                  });
                  renderInvestorMarkers();
                }}
              >
                <h4 className="font-medium text-gray-800">{investor.investor_name}</h4>
                <div className="text-xs text-gray-500 mt-1">
                  {investor.focus_industry}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredInvestors.length === 0 && (
          <div className="mt-3 py-4 text-center text-gray-500">
            No investors match your search criteria
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* CSS for the pulse effect */}
      <style jsx global>{`
        .custom-ticker {
          width: 20px;
          height: 20px;
          position: relative;
        }

        .pulse {
          background: rgba(0, 120, 255, 0.7);
          border-radius: 50%;
          height: 14px;
          width: 14px;
          position: absolute;
          top: 3px;
          left: 3px;
          transform: scale(1);
          transform-origin: center;
          box-shadow: 0 0 0 0 rgba(0, 120, 255, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 120, 255, 0.7);
          }

          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(0, 120, 255, 0);
          }

          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(0, 120, 255, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        /* Scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default Map;