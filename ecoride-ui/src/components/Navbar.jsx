"use client";
import React from "react";
import { FaHome, FaCar, FaSearch, FaCog } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
      <div className="fixed bottom-0 h-[10vh] z-50 w-full -translate-x-1/2 left-1/2 bg-opacity-30 bg-clip-padding backdrop-filter backdrop-blur-sm border-t border-purple-300 dark:border-purple-700">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
          <button data-tooltip-target="tooltip-home" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-purple-300 dark:hover:bg-purple-800 group cursor-pointer">
            <FaHome className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out" />
            <span className="text-xs text-purple-800 dark:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out">Home</span>
          </button>
          <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-purple-300 dark:bg-purple-700 rounded-lg shadow-sm opacity-0 tooltip">
            Home
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-ride" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-purple-300 dark:hover:bg-purple-800 group cursor-pointer">
            <FaCar className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out" />
            <span className="text-xs text-purple-800 dark:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out">Ride</span>
          </button>
          <div id="tooltip-ride" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-purple-300 dark:bg-purple-700 rounded-lg shadow-sm opacity-0 tooltip">
            Ride
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-search" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-purple-300 dark:hover:bg-purple-800 group cursor-pointer">
            <FaSearch className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out" />
            <span className="text-xs text-purple-800 dark:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out">Search</span>
          </button>
          <div id="tooltip-search" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-purple-300 dark:bg-purple-700 rounded-lg shadow-sm opacity-0 tooltip">
            Search
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-settings" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-purple-300 dark:hover:bg-purple-800 group cursor-pointer">
            <FaCog className="w-5 h-5 mb-1 text-purple-600 dark:text-purple-300 group-hover:text-purple-800 dark:group-hover:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out" />
            <span className="text-xs text-purple-800 dark:text-purple-200 group-hover:transform group-hover:scale-110 transition-all duration-200 ease-in-out">Settings</span>
          </button>
          <div id="tooltip-settings" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-purple-300 dark:bg-purple-700 rounded-lg shadow-sm opacity-0 tooltip">
            Settings
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
