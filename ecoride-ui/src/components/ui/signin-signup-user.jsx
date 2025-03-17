"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const AuthComponent = ({
  user,
  onSignIn,
  onSignUp,
  onSignOut,
  primaryColor = "purple", // Default primary color
  textColor = "gray", // Default text color
  backgroundColor = "white", // Default background color
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const primaryColorClasses = {
    bg: `bg-${primaryColor}-600 dark:bg-${primaryColor}-700`,
    hoverBg: `hover:bg-${primaryColor}-500`,
    text: `text-${primaryColor}-800 dark:text-${primaryColor}-200`,
    hoverText: `group-hover:text-${primaryColor}-800 dark:group-hover:text-${primaryColor}-200`,
    dropdownBg: `bg-${primaryColor}-100 dark:bg-${primaryColor}-800`,
    dropdownBorder: `border border-${primaryColor}-300 dark:border-${primaryColor}-700`,
    dropdownHover: `hover:bg-${primaryColor}-300 dark:hover:bg-${primaryColor}-700`,
  };

  const textColorClasses = {
    text: `text-${textColor}-800 dark:text-${textColor}-200`,
    hoverText: `hover:text-${textColor}-700`,
  };

  const backgroundColorClasses = {
    bg: `bg-${backgroundColor}-100`,
  };

  return (
    <div className="relative inline-block">
      {user ? (
        <div
          className={`flex items-center cursor-pointer hover:bg-${primaryColor}-200 dark:hover:bg-${primaryColor}-700 rounded-md p-1 transition-colors duration-200`}
          onClick={handleProfileClick}
        >
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
          )}
          <span className={`text-sm ${primaryColorClasses.text}`}>
            {user.name}
          </span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href="/SignIn">
            <button
              className={`sm:px-4 cursor-pointer sm:py-2 ${primaryColorClasses.bg} text-white rounded-md ${primaryColorClasses.hoverBg} hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:text-white hover:brightness-110 px-2 py-[8px] text-xs`}
            >
              <FontAwesomeIcon icon={faUser} />
              Sign In
            </button>
          </Link>
          <Link href="/SignUp">
            <button
              className={`sm:px-4 cursor-pointer sm:py-2 bg-${primaryColor}-400 text-white rounded-md hover:bg-${primaryColor}-300 hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:bg-${primaryColor}-600 dark:text-white hover:brightness-110 px-2 py-[8px] text-xs`}
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} />
              Sign Up
            </button>
          </Link>
        </div>
      )}

      {user && showDropdown && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 mt-2 w-48 ${primaryColorClasses.dropdownBg} rounded-md shadow-lg z-10 ${primaryColorClasses.dropdownBorder}`}
        >
          <div className="py-1">
            <button
              onClick={() => {
                onSignOut();
                setShowDropdown(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${primaryColorClasses.dropdownHover} ${primaryColorClasses.text} hover:bg-accent/20 transition-colors duration-200`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;