"use client";
import React from "react";
import { FaHome, FaCar, FaSearch, FaCog } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
      <div className="fixed bottom-0 h-[10vh] z-50 w-full -translate-x-1/2 bg-[var(--background)] border-t border-[var(--border)] left-1/2 dark:bg-[var(--background)] dark:border-[var(--border)]">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
          <button data-tooltip-target="tooltip-home" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] group cursor-pointer">
            <FaHome className="w-5 h-5 mb-1 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)]" />
            <span className="text-xs text-[var(--foreground)] dark:text-[var(--foreground)]">Home</span>
          </button>
          <div id="tooltip-home" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Home
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-ride" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] group cursor-pointer">
            <FaCar className="w-5 h-5 mb-1 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)]" />
            <span className="text-xs text-[var(--foreground)] dark:text-[var(--foreground)]">Ride</span>
          </button>
          <div id="tooltip-ride" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Ride
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-search" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] group cursor-pointer">
            <FaSearch className="w-5 h-5 mb-1 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)]" />
            <span className="text-xs text-[var(--foreground)] dark:text-[var(--foreground)]">Search</span>
          </button>
          <div id="tooltip-search" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Search
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          <button data-tooltip-target="tooltip-settings" type="button" className="inline-flex flex-col items-center justify-center p-4 hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] group cursor-pointer">
            <FaCog className="w-5 h-5 mb-1 text-[var(--muted-foreground)] dark:text-[var(--muted-foreground)] group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary)]" />
            <span className="text-xs text-[var(--foreground)] dark:text-[var(--foreground)]">Settings</span>
          </button>
          <div id="tooltip-settings" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            Settings
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;