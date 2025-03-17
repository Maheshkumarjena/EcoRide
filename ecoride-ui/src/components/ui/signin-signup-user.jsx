"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const AuthComponent = ({ user, onSignIn, onSignUp, onSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative inline-block">
      {user ? (
        <div
          className="flex items-center cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-700 rounded-md p-1 transition-colors duration-200"
          onClick={handleProfileClick}
        >
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-purple-800 dark:text-purple-200">
            {user.name}
          </span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Link href='/SignIn'>
          <button
            onClick={onSignIn}
            className="sm:px-4 cursor-pointer sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:bg-purple-700 dark:text-white hover:brightness-110 px-2 py-[8px] text-xs"
            >
            <FontAwesomeIcon icon={faUser} />
            Sign In
          </button>
            </Link>
          <Link href='/SignUp'>
            <button
              onClick={onSignUp}
              className="sm:px-4 cursor-pointer sm:py-2 bg-purple-700 dark:bg-purple-400 text-white rounded-md dark:hover:bg-purple-600 hover:bg-purple-600 hover:scale-105 transition-transform duration-200 flex items-center gap-2 text-sm dark:bg-purple-600 dark:text-white hover:brightness-110 px-2 py-[8px] text-xs"
            >
              <FontAwesomeIcon icon={faArrowRightToBracket} />
              Sign Up
            </button>
          </Link>
        </div>
      )}

      {user && showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-purple-100 dark:bg-purple-800 rounded-md shadow-lg z-10 border border-purple-300 dark:border-purple-700">
          <div className="py-1">
            <button
              onClick={() => {
                onSignOut();
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-purple-300 dark:hover:bg-purple-700 text-purple-800 dark:text-purple-200 hover:bg-accent/20 transition-colors duration-200"
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
