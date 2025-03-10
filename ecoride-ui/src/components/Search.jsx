// components/Search.js
"use client";
import { useState } from "react";

const Search = ({ rides, onSearch, query, setQuery, loading, error }) => {

  console.log("rides at search component", rides)
  return (
    <div className="p-4 w-full h-full overflow-scroll absolute top-0 z-40 rounded-md shadow-input">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        className="border border-purple-600 dark:border-purple-700 p-2 w-full rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
      />
      <ul className="mt-4">
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">Error: {error}</div>
        ) : rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride._id} className="p-2 border-b border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200">
              <p>From: {ride.startAddress}</p>
              <p>To: {ride.destinationAddress}</p>
            </li>
          ))
        ) : (
          <li className="p-2 text-purple-600 dark:text-purple-300">No results found</li>
        )}
      </ul>
    </div>
  );
};

export default Search;