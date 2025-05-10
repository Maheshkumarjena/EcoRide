"use client";
import React, { useEffect, useState } from "react";
import DarkModeToggle from "./ui/theme-toggle";
import AuthComponent from "./ui/signin-signup-user";

const ThemeAuth = () => {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("user from local storage", storedUser);

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const currentTime = Date.now();

        if (userData.expiration && currentTime < userData.expiration) {
          setUser(userData);
        } else {
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.error("Failed to parse user:", err);
        localStorage.removeItem("user");
      }
    }

    setLoaded(true); // ensures we only render once check is done
  }, []);

  if (!loaded) return null;

  return (
    <div className="sticky  p-4 flex flex-row w-full justify-between">
      <DarkModeToggle  />
      <AuthComponent user={user} />
    </div>
  );
};

export default ThemeAuth;
