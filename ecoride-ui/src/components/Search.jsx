"use client";
import { useState } from "react";
import Link from "next/link";

const Search = ({ rides, onSearch, query, setQuery, loading, error, suggestions }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  console.log("rides at search component", rides);

  return (
    <div className="p-4 w-full h-full overflow-scroll absolute top-0 z-40 rounded-md shadow-input">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
          setShowSuggestions(true); // Show suggestions when typing
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Hide suggestions when input loses focus
        className="border border-purple-600 dark:border-purple-700 p-2 w-full rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
      />

      {/* Display autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="mt-2 bg-white dark:bg-purple-900 border border-purple-600 dark:border-purple-700 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800 cursor-pointer text-purple-800 dark:text-purple-200"
              onClick={() => {
                setQuery(suggestion.name); // Set the input value to the selected suggestion
                setShowSuggestions(false); // Hide suggestions after selection
              }}
            >
              <p>{suggestion.name}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">{suggestion.address}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Display search results */}
      <ul className="mt-4">
        <div>

          {loading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">Error: {error}</div>
          ) : rides.length > 0 ? (
            rides.map((ride) => (
              <li key={ride._id} className="p-2 border-b border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200">
                <div className="flex flex-col w-[80%]">

                  <p>From: {ride.startAddress}</p>
                  <p>To: {ride.destinationAddress}</p>
                </div>

                <div>
                  <Link href={`/Ride/${ride._id}`}>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      aria-label={`View details for ride ${ride.startAddress || ride.startingPoint} to ${ride.destinationAddress || ride.destination}`}
                    >
                      View Details
                    </button>
                  </Link>
                </div>

              </li>
            ))
          ) : (
            <li className="p-2 text-purple-600 dark:text-purple-300">No results found</li>
          )}

        </div>

      </ul>

    </div>
  );
};

export default Search;