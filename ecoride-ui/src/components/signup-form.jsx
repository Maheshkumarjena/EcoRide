"use client";
import axios from "axios";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from 'next/navigation'; // For Next.js App Router
import { motion } from "framer-motion";
import Loader from "./ui/Loader";
import { toast } from "sonner";

export default function SignupForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  // Backend URL should be placed in an environment variable
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
  console.log("server url:", API_URL);

  const registerUser = async () => {
    setLoading(true);

    if (!firstname || !lastname || !email || !password) {
      alert("All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        firstname,
        lastname,
        email,
        password,
      });
      console.log("User registered successfully:", response.data);
      setLoading(false);
      toast.success("User registered successfully. Redirecting to sign in page...");
      setTimeout(() => {
        router.push('/SignIn');
        setMessage("");
      }, 2000);
    } catch (error) {
      console.error("Error registering user:", error.response?.data || error.message);
      setLoading(false);
      toast.error(`Error: ${error.response?.data.message || error.message}`);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="my-[10vh] w-md w-full mx-auto rounded-xl md:rounded-2xl p-4 md:p-8 shadow-input bg-purple-200 dark:bg-purple-900"
    >
      <h2 className="font-bold text-xl text-purple-800 dark:text-purple-200">Welcome to EcoRide</h2>
      <p className="text-purple-600 text-sm max-w-sm mt-2 dark:text-purple-300">Join the Ride, Change the Future!</p>

      <form className="my-8 z-0" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br cursor-pointer relative group/btn from-purple-600 dark:from-purple-700 dark:to-purple-700 to-purple-400 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative cursor-pointer group/btn flex space-x-2 items-center justify-start px-4 w-full text-purple-900 dark:text-purple-300 rounded-md h-10 font-medium shadow-input bg-purple-50 dark:bg-purple-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button"
          >
            <IconBrandGoogle className="h-4 w-4 text-purple-800 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300 text-sm">Google</span>
            <BottomGradient />
          </button>

          <p className="text-sm">Already have an account?</p>
          <Link href="/SignIn">
            <button
              className="relative cursor-pointer group/btn flex items-center justify-center px-4 w-full text-purple-900 dark:text-purple-300 rounded-md h-10 font-medium shadow-input bg-purple-50 dark:bg-purple-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
            >
              Sign in
              <BottomGradient />
            </button>
          </Link>
        </div>
      </form>
      {loading && <Loader />}
      {message && <p className="text-purple-800 dark:text-purple-200">{message}</p>}
    </motion.div>
  );
}

// Bottom gradient effect
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </>
  );
};

// Wrapper for label and input
const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};