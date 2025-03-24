"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Splash } from "../../public/images";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("uid")) {
      router.push("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { uid } = response.data;

        if (uid) {
          Cookies.set("uid", uid, { expires: 7 }); // Store UID in Cookies for 7 days
          router.push("/dashboard");
          window.location.reload();
        } else {
          setError("User ID not found. Please try again.");
        }
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto h-screen items-center justify-center">
      {" "}
      {/* Center and limit width */}
      <Card className="overflow-hidden p-0 w-full h-auto md:h-[500px]">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 md:p-8 w-full md:w-[450px]"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start text-left">
                <h1 className="text-2xl font-bold">Welcome to Innovise</h1>
                <p className="text-muted-foreground text-balance">
                  Login to manage your business
                </p>
              </div>

              {/* Email Input */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#F3F0E7] text-black hover:bg-accent"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </div>
          </form>

          {/* Right Image Section */}
          <div className="bg-gray-100 hidden md:flex items-center justify-center">
            <Image
              src={Splash}
              alt="Login"
              className="w-full h-full object-contain rounded-md"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        © 2024-2025 Innovise, IPD CS-G3, B.Tech, Dwarkadas J. Sanghvi College of
        Engineering, Mumbai.<br></br>
        Jeel Doshi, Vatsal Kotha, Meet Chavan.
      </div>
    </div>
  );
}
