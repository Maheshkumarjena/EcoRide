"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import Link from 'next/link'

export default function SignupForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };
  return (
    <div
      className=" w-screen md:w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-purple-200 dark:bg-purple-900">
      <h2 className="font-bold text-xl text-purple-800 dark:text-purple-200">
        Welcome to EcoRide
      </h2>
      <p className="text-purple-600 text-sm max-w-sm mt-2 dark:text-purple-300">
        Join the Ride, Change the Future!    
      </p>
      <form className="my-8 z-0" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>
       
        <button
          className="bg-gradient-to-br cursor-pointer relative group/btn from-purple-600 dark:from-purple-700 dark:to-purple-700 to-purple-400 block w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div
          className="bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className="relative cursor-pointer group/btn flex space-x-2 items-center justify-start px-4 w-full text-purple-900 dark:text-purple-300 rounded-md h-10 font-medium shadow-input bg-purple-50 dark:bg-purple-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit">
            <IconBrandGoogle className="h-4 w-4 text-purple-800 dark:text-purple-300" />
            <span className="text-purple-700 dark:text-purple-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
<p className='mb-[1px] text-sm  '>          Already have an account ?  </p>
      <Link href='SignIn'>
          <button
            className="relative cursor-pointer group/btn flex items-center justify-center px-4 w-full text-purple-900 dark:text-purple-300 rounded-md h-10 font-medium shadow-input bg-purple-50 dark:bg-purple-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="button">
              Sign in
            <BottomGradient />
          </button>
          </Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <span
        className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
