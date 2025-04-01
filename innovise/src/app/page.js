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
import Index from "./landing/page";

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page({ className }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (Cookies.get("uid")) {
      router.push("/dashboard");
    } 
  }, []);



  return (
<Index></Index>
  );
}