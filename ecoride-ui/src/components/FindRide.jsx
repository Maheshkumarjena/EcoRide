"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getAddressFromCoordinates, getAutoCompleteSuggestions } from "@/lib/utils";
import RideList from "./RideList";
import _ from "lodash";
import Loader from "./ui/Loader";
import Modal from "./Modal";
import { toast } from "sonner";

const FindRide = () => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
  const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [onboarding, setOnboarding] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [foundRides, setFoundRides] = useState([]);
  const [ridesWithAddresses, setRidesWithAddresses] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [onboardingSuggestions, setOnboardingSuggestions] = useState([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showOnboardingSuggestions, setShowOnboardingSuggestions] = useState(false);

  const handleFromSearch = useCallback(
    _.debounce(async (searchValue) => {
      if (searchValue.trim()) {
        const suggestions = await getAutoCompleteSuggestions(searchValue);
        setFromSuggestions(suggestions);
        setShowFromSuggestions(true);
      } else {
        setFromSuggestions([]);
        setShowFromSuggestions(false);
      }
    }, 300),
    []
  );

  const handleToSearch = useCallback(
    _.debounce(async (searchValue) => {
      if (searchValue.trim()) {
        const suggestions = await getAutoCompleteSuggestions(searchValue);
        setToSuggestions(suggestions);
        setShowToSuggestions(true);
      } else {
        setToSuggestions([]);
        setShowToSuggestions(false);
      }
    }, 300),
    []
  );

  const handleOnboardingSearch = useCallback(
    _.debounce(async (searchValue) => {
      if (searchValue.trim()) {
        const suggestions = await getAutoCompleteSuggestions(searchValue);
        setOnboardingSuggestions(suggestions);
        setShowOnboardingSuggestions(true);
      } else {
        setOnboardingSuggestions([]);
        setShowOnboardingSuggestions(false);
      }
    }, 300),
    []
  );

  const handleFind = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const startTime = `<span class="math-inline">\{date\}T</span>{time}:00Z`;
      const response = await axios.post(`${API_URL}/rides/findRide`, {
        startingPoint: fromLocation,
        destination: toLocation,
        startTime: startTime,
        minPrice: maxPrice ? 0 : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        onboarding: onboarding,
      });
      setFoundRides(response.data.rides);
      setLoading(false);
      setIsModalOpen(true);
      console.log("Rides before processing:", response.data.rides);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";

      toast.error(errorMessage);
      console.error("Error finding rides:", error);
      setFoundRides([]);
    }
  };

  useEffect(() => {
    async function fetchAddresses() {
      if (foundRides.length === 0) return;

      const ridesWithAddressesPromises = foundRides.map(async (ride) => {
        const startAddress = await getAddressFromCoordinates(ride.startingPoint.coordinates.lat, ride.startingPoint.coordinates.lng, MAP_URL);
        const destinationAddress = await getAddressFromCoordinates(ride.destination.coordinates.lat, ride.destination.coordinates.lng, MAP_URL);
        return {
          ...ride,
          startAddress,
          destinationAddress,
        };
      });

      const ridesWithAddresses = await Promise.all(ridesWithAddressesPromises);
      console.log("processed rides with location :", ridesWithAddresses);
      setRidesWithAddresses(ridesWithAddresses);
    }

    fetchAddresses();
  }, [foundRides, API_URL, MAP_URL]);

  useEffect(() => {
    // Moved the setShowFromSuggestions(false) here.
    if (fromLocation) setShowFromSuggestions(false);
  }, [fromLocation]);

  useEffect(() => {
    // Moved the setShowToSuggestions(false) here.
    if (toLocation) setShowToSuggestions(false);
  }, [toLocation]);

  useEffect(() => {
    // Moved the setShowOnboardingSuggestions(false) here.
    if (onboarding) setShowOnboardingSuggestions(false);
  }, [onboarding]);

  return (

    <div className="relative">

      {loading && (
        <div className="relative">
          {loading && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 pointer-events-none">
              <div className="absolute inset-0 bg-transparent bg-opacity-20 backdrop-filter backdrop-blur-[5px] pointer-events-auto flex justify-center items-center">
                <Loader />
              </div>
            </div>
          )}

          <div
            className={`p-4 pb-20 bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 ${loading ? "pointer-events-none" : ""
              }`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-purple-900 dark:text-purple-100">
              Find a Ride
            </h2>
            <form onSubmit={handleFind}>
              {/* ... (Your form inputs) */}
              <div className="mb-4 relative">
                <label
                  htmlFor="from"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  value={fromLocation}
                  onChange={(e) => {
                    setFromLocation(e.target.value);
                    handleFromSearch(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                  placeholder="Enter departure location"
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <ul className="absolute mt-2border border-purple-600 dark:border-purple-700 rounded-md dark:bg-purple-800 border border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200  shadow-lg w-full z-10">
                    {fromSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-md cursor-pointer"
                        onClick={() => {
                          setFromLocation(`${suggestion.name}, ${suggestion.address}`);
                        }}
                      >
                        {suggestion.name}, {suggestion.address}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="to"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  To
                </label>
                <input
                  type="text"
                  id="to"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    handleToSearch(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                  placeholder="Enter destination location"
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <ul className="absolute mt-2  border border-purple-600 dark:border-purple-700 rounded-md dark:bg-purple-800 border border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200  rounded-md shadow-lg w-full z-10">
                    {toSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                        onClick={() => {
                          setToLocation(`${suggestion.name}, ${suggestion.address}`);
                        }}
                      >
                        {suggestion.name}, {suggestion.address}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mb-4 relative">
                <label
                  htmlFor="onboarding"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  Onboarding Point
                </label>
                <input
                  type="text"
                  id="onboarding"
                  value={onboarding}
                  onChange={(e) => {
                    setOnboarding(e.target.value);
                    handleOnboardingSearch(e.target.value);
                  }}
                  onBlur={() => setTimeout(() => setShowOnboardingSuggestions(false), 200)}
                  placeholder="Enter onboarding location"
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
                {showOnboardingSuggestions && onboardingSuggestions.length > 0 && (
                  <ul className="absolute mt-2 border border-purple-600 dark:border-purple-700 rounded-md dark:bg-purple-800 border border-purple-600 dark:border-purple-700 text-purple-800 dark:text-purple-200  shadow-lg w-full z-10">
                    {onboardingSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                        onClick={() => {
                          setOnboarding(`${suggestion.name}, ${suggestion.address}`);
                        }}
                      >
                        {suggestion.name}, {suggestion.address}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* ... (Your date, time, maxPrice inputs and submit button) */}
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="findTime"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  Time
                </label>
                <input
                  type="time"
                  id="findTime"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="maxPrice"
                  className="block text-sm font-medium text-purple-700 dark:text-purple-300"
                >
                  Max Price
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Enter max fare"
                  className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
              >
                Find Ride
              </button>
            </form>
          </div>
        </div>
      )}

      <div
        className={`p-4 pb-20 bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 ${loading ? "blur-md" : ""
          }`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-purple-900 dark:text-purple-100">
          Find a Ride
        </h2>
        <form onSubmit={handleFind}>
          {/* ... (Your existing form inputs: from, to, onboarding, date, time, maxPrice) */}

          <div className="mb-4 relative">
            <label
              htmlFor="from"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              From
            </label>
            <input
              type="text"
              id="from"
              value={fromLocation}
              onChange={(e) => {
                setFromLocation(e.target.value);
                handleFromSearch(e.target.value);
              }}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              placeholder="Enter departure location"
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
            {showFromSuggestions && fromSuggestions.length > 0 && (
              <ul className="absolute mt-2 border border-purple-600 dark:border-purple-700 rounded-md bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 shadow-lg w-full z-10">
                {fromSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-md cursor-pointer"
                    onClick={() => {
                      setFromLocation(`${suggestion.name}, ${suggestion.address}`);
                    }}
                  >
                    {suggestion.name}, {suggestion.address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="to"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              To
            </label>
            <input
              type="text"
              id="to"
              value={toLocation}
              onChange={(e) => {
                setToLocation(e.target.value);
                handleToSearch(e.target.value);
              }}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              placeholder="Enter destination location"
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
            {showToSuggestions && toSuggestions.length > 0 && (
              <ul className="absolute mt-2 border border-purple-600 dark:border-purple-700 rounded-md bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 shadow-lg w-full z-10">
                {toSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                    onClick={() => {
                      setToLocation(`${suggestion.name}, ${suggestion.address}`);
                    }}
                  >
                    {suggestion.name}, {suggestion.address}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="onboarding"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              Onboarding Point
            </label>
            <input
              type="text"
              id="onboarding"
              value={onboarding}
              onChange={(e) => {
                setOnboarding(e.target.value);
                handleOnboardingSearch(e.target.value);
              }}
              onBlur={() => setTimeout(() => setShowOnboardingSuggestions(false), 200)}
              placeholder="Enter onboarding location"
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
            {showOnboardingSuggestions && onboardingSuggestions.length > 0 && (
              <ul className="absolute mt-2 border border-purple-600 dark:border-purple-700 rounded-md bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 shadow-lg w-full z-10">
                {onboardingSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-700 cursor-pointer"
                    onClick={() => {
                      setOnboarding(`${suggestion.name}, ${suggestion.address}`);
                    }}
                  >
                    {suggestion.name}, {suggestion.address}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="findTime"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              Time
            </label>
            <input
              type="time"
              id="findTime"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="maxPrice"
              className="block text-sm font-medium text-purple-700 dark:text-purple-300"
            >
              Max Price
            </label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Enter max fare"
              className="mt-1 p-2 w-full border border-purple-600 dark:border-purple-700 rounded-md bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 placeholder-purple-600 dark:placeholder-purple-300 focus:border-purple-700 dark:focus:border-purple-300 focus:ring-purple-700 dark:focus:ring-purple-300"
            />
          </div>


          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
          >
            Find Ride
          </button>
        </form>

        <Modal isOpen={isModalOpen}   onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-bold">Choose the Ride that suites u the best !</h2>
          <p>One step close towards saving the earth</p>
          <RideList rides={ridesWithAddresses} />

        </Modal>
      </div>
    </div>
  );
};

export default FindRide;