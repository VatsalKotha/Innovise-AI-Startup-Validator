"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import axios from "axios";
import JsCookies from "js-cookie";

export default function ProfilePage() {
  const [formData, setFormData] = useState(new FormData());
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const uid = JsCookies.get("uid") // Replace with dynamic UID fetching
  const apiURL = `${process.env.NEXT_PUBLIC_API_URL}/get_user/${uid}`;

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(apiURL);
        if (res.data) {
          console.log("Fetched Data:", res.data);
          const form = new FormData();
          Object.keys(res.data).forEach((key) => form.append(key, res.data[key]));
          setFormData(form);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [uid]);

  const handleChange = (e) => {
    const form = new FormData(formData);
    form.set(e.target.name, e.target.value);
    setFormData(form);
  };

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/update_user/${uid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditing(false);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <motion.div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <Card>
        <CardHeader className="text-center">
          <h2 className="text-2xl font-bold">Profile</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center">
            {/* <img
              src={formData.get("avatar") || "/placeholder.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full shadow-md"
            /> */}
            <p className="text-lg font-semibold mt-2">{formData.get("name")}</p>
            <p className="text-sm text-gray-500">{formData.get("email")}</p>
          </div>
          {editing ? (
            <>
              <Input name="name" defaultValue={formData.get("name")} onChange={handleChange} placeholder="Name" />
              <Input name="email" defaultValue={formData.get("email")} onChange={handleChange} placeholder="Email" />
              <Input name="bio" defaultValue={formData.get("bio")} onChange={handleChange} placeholder="Bio" />
            </>
          ) : (
            <div className="text-gray-700">
              <p><strong>Bio:</strong> {formData.get("bio") || "No bio available"}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {editing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit Profile</Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
