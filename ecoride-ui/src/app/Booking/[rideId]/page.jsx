"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAddressFromCoordinates } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const BookingPage = ({ params }) => {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
  const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY;
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { rideId } = unwrappedParams;
  const [user, setUser] = useState(null);
  const [ride, setRide] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [rideWithAddresses, setRideWithAddresses] = useState(null);

  console.log("ride id at Booking page===========================>", rideId);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      const currentTime = Date.now();
      if (userData.expiration && currentTime < userData.expiration) {
        setUser(userData);
      } else {
        localStorage.removeItem('user');
        router.push('/SignIn');
      }
    } else {
      router.push('/SignIn');
    }
  }, [router]);

  useEffect(() => {
    if (rideId) {
      axios.get(`${API_URL}/rides/${rideId}`, { withCredentials: true })
        .then(response => {
          console.log("response at booking------------------->", response);
          setRide(response.data.ride);
        })
        .catch(err => {
          console.error("Failed to fetch ride:", err);
          setError("Failed to fetch ride details.");
        });
    }
  }, [rideId, API_URL]);

  useEffect(() => {
    async function fetchAddress() {
      if (!ride) return;

      try {
        const startAddress = await getAddressFromCoordinates(
          ride.startingPoint.coordinates.lat,
          ride.startingPoint.coordinates.lng,
          MAP_URL
        );

        const destinationAddress = await getAddressFromCoordinates(
          ride.destination.coordinates.lat,
          ride.destination.coordinates.lng,
          MAP_URL
        );

        const rideWithAddresses = {
          ...ride,
          startAddress,
          destinationAddress,
        };

        console.log("Processed ride with location:", rideWithAddresses);
        setRideWithAddresses(rideWithAddresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Error fetching addresses.");
      }
    }

    fetchAddress();
  }, [ride, API_URL, MAP_URL]);

  const handleBook = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      if (!rideWithAddresses) {
        setError("Ride details not found.");
        return;
      }
      if (seatsToBook > rideWithAddresses.totalSeatsAvailable) {
        setError("Not enough seats available.");
        return;
      }

      await axios.post(`${API_URL}/bookings/createBooking/${rideWithAddresses._id}`, {
        userId: user._id,
        seats: seatsToBook,
      }, { withCredentials: true });

      setSuccessMessage("Booking successful!");
      toast.success("Booking successful!"); // Use toast here
      router.push('/profile');
    } catch (err) {
      console.error("Booking failed:", err.response?.data?.message || err);
      const errorMessage = err.response?.data?.message || "Booking failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage); // Use toast here
    }
  };

  if (!ride) {
    return <div className="p-4">Loading...</div>;
  }

  console.log("rides and rides and", rideWithAddresses);
  return (
    <div className="p-4 pb-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center  dark:text-w ">
      <div className="max-w-2xl w-full pb-14 hide-scrollbar overflow-y-scroll  ">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white ">Book Ride</h2>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}

        {rideWithAddresses && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg border  border-gray-200 dark:border-gray-700  ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100  hite">
                Ride Details
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Confirm your booking details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.startAddress}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">To:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.destinationAddress}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(rideWithAddresses.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(rideWithAddresses.startTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Price per seat:</span>
                <p className="text-gray-900 dark:text-gray-100">${rideWithAddresses.farePerSeat}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Seats Available:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.totalSeatsAvailable}</p>
              </div>

              <div className="space-y-4 mt-6">
                <label htmlFor="seats" className="block text-sm   font-medium text-gray-700 dark:text-gray-300">
                  Number of Seats
                </label>
                <Input
                  type="number"
                  id="seats"
                  value={seatsToBook}
                  onChange={(e) => setSeatsToBook(parseInt(e.target.value, 10))}
                  min="1"
                  max={ride.totalSeatsAvailable}
                  placeholder="Enter number of seats"
                  className="mt-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-purple-400 dark:border-purple-600 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              <Button
                onClick={handleBook}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Book Ride
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
