// pages/search-page.js (or wherever you're using Search)
"use client";
import { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import axios from "axios";
import Search from "@/components/Search"; // Adjust the path as needed
import { getAddressFromCoordinates } from "@/lib/utils";

const SearchPage = () => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY 
    console.log("map url ", MAP_URL)
    const [query, setQuery] = useState("");
    const [rides, setRides] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ridesWithAddresses, setRidesWithAddresses] = useState([]); // State to store rides with addresses
    

    useEffect(() => {
        const fetchRides = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/rides/getAllRides`, {
                    withCredentials: true,
                });
                setRides(response.data.rides);
                setFilteredResults(response.data.rides);
            } catch (err) {
                setError(err.message || "Failed to fetch rides.");
            } finally {
                setLoading(false);
            }
        };

        fetchRides();
    }, [API_URL]);

    console.log("rides fetched =================>",rides)


    useEffect(() => {
            async function fetchAddresses() {
                if (rides.length === 0) return;
              
                const ridesWithAddressesPromises = rides.map(async (ride) => {
                    console.log("rides starting point lat ",ride.startingPoint.coordinates.lat )
                    console.log("rides destination  lat ",ride.destination.coordinates.lat )
                    const startAddress = await getAddressFromCoordinates(ride.startingPoint.coordinates.lat, ride.startingPoint.coordinates.lng, MAP_URL);
                    const destinationAddress = await getAddressFromCoordinates(ride.destination.coordinates.lat, ride.destination.coordinates.lng, MAP_URL);
                    return {
                        ...ride,
                        startAddress,
                        destinationAddress,
                    };
                });
    
                const ridesWithAddresses = await Promise.all(ridesWithAddressesPromises);
                console.log("processed rides with locaiton :", ridesWithAddresses)
                setRidesWithAddresses(ridesWithAddresses);
            }
    
            fetchAddresses();
        }, [rides, API_URL]); // Run when foundRides or API_URL changes
    



    const handleSearch = useCallback(
        _.debounce((searchValue) => {
            if (!searchValue.trim()) {
                setFilteredResults('');
            } else {
                setFilteredResults(
                    ridesWithAddresses.filter((ride) =>
                        ride.startAddress.toLowerCase().includes(searchValue.toLowerCase()) ||
                        ride.destinationAddress.toLowerCase().includes(searchValue.toLowerCase())
                    )
                );
            }
        }, 300),
        [ridesWithAddresses]
    );

    useEffect(() => {
        handleSearch(query);
    }, [query, handleSearch]);

    return (
        <Search
            rides={filteredResults}
            onSearch={handleSearch}
            query={query}
            setQuery={setQuery}
            loading={loading}
            error={error}
        />
    );
};

export default SearchPage;