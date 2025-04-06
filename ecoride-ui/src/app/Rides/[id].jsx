// pages/ride/[id].js
"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RideDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";

  useEffect(() => {
    if (!id) return;

    const fetchRide = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/rides/${id}`, {
          withCredentials: true,
        });
        setRide(response.data.ride);
      } catch (err) {
        setError(err.message || 'Failed to fetch ride details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [id,API_URL]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!ride) return <div className="p-4">Ride not found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Ride Details</h1>
      <div className="border p-4 rounded-md shadow-sm">
        <p>
          <strong>Starting Point:</strong> {ride.startAddress || ride.startingPoint}
        </p>
        <p>
          <strong>Destination:</strong> {ride.destinationAddress || ride.destination}
        </p>
        {/* Add other ride details here, for example: */}
        {ride.departureTime && (<p><strong>Departure Time:</strong> {ride.departureTime}</p>)}
        {ride.arrivalTime && (<p><strong>Arrival Time:</strong> {ride.arrivalTime}</p>)}
        {ride.price && (<p><strong>Price:</strong> ${ride.price}</p>)}
        {ride.driver && (<p><strong>Driver:</strong> {ride.driver.name}</p>)}
        {/* Add more details as needed */}
      </div>
      <button onClick={() => router.back()} className="mt-4 bg-gray-300 text-gray-700 p-2 rounded-md">
        Back
      </button>
    </div>
  );
};

export default RideDetailPage;