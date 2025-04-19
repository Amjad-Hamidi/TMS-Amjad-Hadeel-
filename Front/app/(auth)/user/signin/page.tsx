'use client';

import { Button, Label, TextInput, Alert } from "flowbite-react";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useAuth } from "@/context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useAuth();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); 
  
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
  
      dispatch({ type: "LOGIN", payload: data.user });
  
      setSuccess("Login successful!"); 
      router.push("/dashboard"); // Redirect to dashboard after successful login
    } catch (error: any) {
      setError(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto flex-col md:flex-row md:items-center gap-[90px] dark:bg-[rgb(16,23,42)]">
        {/* Left */}
        <div className="flex-1">
          <Link href="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Training
            </span>
            Management
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign in with your email and password .
          </p>
        </div>

        {/* Right */}
        <div className="flex-1">
          {error && <Alert color="failure" className="mb-4">{error}</Alert>} 
          {success && <Alert color="success" className="mb-4">{success}</Alert>} 
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput type="email" placeholder="name@company.com" id="email" onChange={handleChange} required />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="**********" id="password" onChange={handleChange} required />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link href="/user/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
