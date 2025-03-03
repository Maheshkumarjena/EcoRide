"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Typewriter = () => {
  const words = [
    "Hello, Travelers!",
    "Welcome to EcoRide!",
    "Share a Ride, Save the Planet!",
];


  const [user, setUser] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const type = () => {
      let word = words[i];
      if (isDeleting) {
        setCurrentWord(word.substring(0, j - 1));
        setJ(j - 1);
        if (j === 0) {
          setIsDeleting(false);
          setI((i + 1) % words.length); // Move to the next word
        }
      } else {
        setCurrentWord(word.substring(0, j + 1));
        setJ(j + 1);
        if (j === word.length) {
          setIsDeleting(true);
        }
      }
    };

    const timer = setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, [i, j, isDeleting, words]); // Re-run the effect when these dependencies change

  return (
    <div className="overflow-x-hidden absolute lg:relative top-0 w-[100vw] h-[40vh] lg:h-full">
      <div>

      </div>
      <div className="absolute inset-0 top-[-10vw] flex justify-center flex-col items-center">
        <h1 id="typewriter" className="px-2 py-2 text-xl font-mono md:text-4xl font-bold text-purple-800 dark:text-gray-200 border-0">
          {currentWord}
        </h1>
        <div className="flex flex-row gap-6">
          <Link href="/About">
            <button className="text-[10px] lg:text-lg px-3 lg:px-5 py-1 lg:py-2 border border-purple-600 text-purple-600 bg-transparent rounded-md hover:bg-purple-600 hover:text-white transition-all duration-200 ease-in-out">
              Learn More
            </button>
          </Link>
          <Link href={user ? "/Ride" : "/SignUp"}>
            <button className="text-[10px] lg:text-lg rounded-[40px] px-3 lg:px-5 py-1 lg:py-2 bg-purple-600 text-white hover:bg-purple-500 hover:scale-105 transition-transform duration-200 ease-in-out">
              {user ? "Ride" : "Join Now"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Typewriter;
