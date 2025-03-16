"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const BookingPage = ({params}) => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const router = useRouter();
    const searchParams = useSearchParams();
const unwrappedParams = React.use(params); // Unwrap the `params` Promise
  const { id } = unwrappedParams;    
  const [user, setUser] = useState(null);
    const [ride, setRide] = useState(null);
    const [seatsToBook, setSeatsToBook] = useState(1);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    
    console.log("ride id at Booking page===========================>",id)
    // useEffect(() => {
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //         const userData = JSON.parse(storedUser);
    //         const currentTime = Date.now();
    //         if (userData.expiration && currentTime < userData.expiration) {
    //             setUser(userData);
    //         } else {
    //             localStorage.removeItem('user');
    //             router.push('/SignIn');
    //         }
    //     } else {
    //         router.push('/SignIn');
    //     }
    // }, [router]);

    useEffect(() => {
        if (id ) {
            axios.get(`${API_URL}/rides/${id}`, { withCredentials: true })

                .then(response => {
                    console.log("response at booking------------------->", response)
                    setRide(response.data.ride);
                })
                .catch(err => {
                    console.error("Failed to fetch ride:", err);
                    setError("Failed to fetch ride details.");
                });
        }
    }, []);
    console.log(ride)

    const handleBook = async () => {
        setError(null);
        setSuccessMessage(null);
        try {
            if (!ride) {
                setError("Ride details not found.");
                return;
            }
            if (seatsToBook > ride.totalSeatsAvailable) {
                setError("Not enough seats available.");
                return;
            }

            await axios.post(`${API_URL}/bookings/createBooking`, {
                id: ride._id,
                userId: user._id,
                seats: seatsToBook,
            }, { withCredentials: true });

            setSuccessMessage("Booking successful!");
            router.push('/profile'); // Redirect to user profile
        } catch (err) {
            console.error("Booking failed:", err.response?.data?.message || err);
            setError(err.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    if (!ride) {
        return <div className="p-4">Loading...</div>;
    }

    console.log("rides and rides and",ride)
    return (
        <div className="p-4 pb-20">
            <h2 className="text-2xl font-semibold mb-4">Book Ride</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

            <div className="mb-4">
                <p><strong>From:</strong> {ride.startingPoint.coordinates.lat}, {ride.startingPoint.coordinates.lng}</p>
                <p><strong>To:</strong> {ride.destination.coordinates.lat}, {ride.destination.coordinates.lng}</p>
                <p><strong>Date:</strong> {new Date(ride.startTime).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(ride.startTime).toLocaleTimeString()}</p>
                <p><strong>Price per seat:</strong> ${ride.farePerSeat}</p>
                <p><strong>Seats Available:</strong> {ride.totalSeatsAvailable}</p>
            </div>

            <div className="mb-4">
                <label htmlFor="seats" className="block text-sm font-medium text-gray-700">Number of Seats</label>
                <input
                    type="number"
                    id="seats"
                    value={seatsToBook}
                    onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
                    min="1"
                    max={ride.totalSeatsAvailable}
                    className="mt-1 p-2 w-full border rounded-md focus:ring focus:ring-purple-300 focus:outline-none"
                />
            </div>

            <button onClick={handleBook} className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700">Book Ride</button>
        </div>
    );
};

export default BookingPage;