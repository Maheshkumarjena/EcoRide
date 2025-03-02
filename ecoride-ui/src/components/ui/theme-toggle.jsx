"use client";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "next-themes";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  return (
    <div className="h-fit w-fit flex justify-center items-center  ">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="rounded-full p-2 h-10 w-10 hover:bg-gray-200 bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-700"
      >
        {theme === "light" ? (
          <FontAwesomeIcon icon={faSun} className="text-yellow-500" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="text-violet-700" />
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
