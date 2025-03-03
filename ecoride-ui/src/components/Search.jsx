"use client";
import { useState, useEffect, useCallback } from "react";
import _ from "lodash";

const sampleData = [
  { id: 1, title: "Next.js Guide", category: "Web Development" },
  { id: 2, title: "React Hooks Explained", category: "JavaScript" },
  { id: 3, title: "Understanding Debouncing", category: "Performance" },
  { id: 4, title: "Building REST APIs with Express", category: "Backend" },
  { id: 5, title: "CSS Grid vs Flexbox", category: "Frontend" },
  { id: 6, title: "State Management with Redux", category: "JavaScript" },
  { id: 7, title: "Authentication in Next.js", category: "Security" },
  { id: 8, title: "Server-side Rendering (SSR) in Next.js", category: "Performance" },
  { id: 9, title: "Best Practices for SEO in Next.js", category: "SEO" },
  { id: 1, title: "Next.js Guide", category: "Web Development" },
  { id: 2, title: "React Hooks Explained", category: "JavaScript" },
  { id: 3, title: "Understanding Debouncing", category: "Performance" },
  { id: 4, title: "Building REST APIs with Express", category: "Backend" },
  { id: 5, title: "CSS Grid vs Flexbox", category: "Frontend" },
  { id: 6, title: "State Management with Redux", category: "JavaScript" },
  { id: 7, title: "Authentication in Next.js", category: "Security" },
  { id: 8, title: "Server-side Rendering (SSR) in Next.js", category: "Performance" },
  { id: 9, title: "Best Practices for SEO in Next.js", category: "SEO" },{ id: 1, title: "Next.js Guide", category: "Web Development" },
  { id: 2, title: "React Hooks Explained", category: "JavaScript" },
  { id: 3, title: "Understanding Debouncing", category: "Performance" },
  { id: 4, title: "Building REST APIs with Express", category: "Backend" },
  { id: 5, title: "CSS Grid vs Flexbox", category: "Frontend" },
  { id: 6, title: "State Management with Redux", category: "JavaScript" },
  { id: 7, title: "Authentication in Next.js", category: "Security" },
  { id: 8, title: "Server-side Rendering (SSR) in Next.js", category: "Performance" },
  { id: 9, title: "Best Practices for SEO in Next.js", category: "SEO" },
  { id: 10, title: "Optimizing Images in Next.js", category: "Performance" },
];

const Search = () => {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(sampleData);

  // Debounced function to handle search
  const handleSearch = useCallback(
    _.debounce((searchValue) => {
      if (!searchValue.trim()) {
        setFilteredResults(sampleData);
      } else {
        setFilteredResults(
          sampleData.filter((item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase())
          )
        );
      }
    }, 300), // Delay execution by 300ms
    []
  );

  // Trigger debounced search on query change
  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  return (
    <div className="p-4 bg-purple-200 w-full h-full overflow-scroll  dark:bg-purple-900 absolute top-0 z-40 rounded-md shadow-input">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-purple-600 dark:border-purple-700 p-2 w-full rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
      />

      <ul className="mt-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((item) => (
            <li
              key={item.id}
              className="p-2 border-b border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200"
            >
              {item.title}
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
