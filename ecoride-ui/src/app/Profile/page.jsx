"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [futureRides, setFutureRides] = useState([]);
  const [userStats, setUserStats] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    ridesProvided: 0,
    ridesUsed: 0,
    averageRating: null,
    profilePic: "https://ts2.mm.bing.net/th?id=OIP.mYlRBlOMAf7Ydfon6yAd0QHaE5&pid=15.1",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/future-rides")
      .then((response) => {
        setFutureRides(response.data);
      })
      .catch(() => {
        setFutureRides([
          {
            id: 1,
            destination: "Los Angeles",
            date: "2025-03-20",
            time: "10:00 AM",
            seatsAvailable: 3,
          },
        ]);
      });

    axios
      .get("/api/user-stats")
      .then((response) => {
        setUserStats((prev) => ({ ...prev, ...response.data }));
      })
      .catch(() => {
        setUserStats((prev) => ({
          ...prev,
          ridesProvided: 5,
          ridesUsed: 8,
          averageRating: 4.5,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-purple-800 dark:text-purple-200">Loading...</div>;
  }

  return (
    <div className="min-h-screen overflow-y-scroll pb-30 bg-purple-50 dark:bg-purple-900 py-8 text-purple-800 dark:text-purple-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-purple-800 shadow rounded-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              className="w-24 h-24 rounded-full object-cover"
              src={userStats.profilePic}
              alt="User Avatar"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-purple-900 dark:text-purple-100">{userStats.fullName}</h1>
              <p className="text-purple-600 dark:text-purple-400">Driver & Passenger</p>
              <p className="text-purple-600 dark:text-purple-400">Joined January 2023</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-purple-800 shadow rounded-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-6">User Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Rides Provided</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.ridesProvided}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Rides Used</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.ridesUsed}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Average Rating</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">
                {userStats.averageRating ? `${userStats.averageRating} ⭐` : "No ratings yet"}
              </p>
            </div>
          </div>
        </div>

        {futureRides.length > 0 && (
          <div className="mt-8 bg-white dark:bg-purple-800 shadow rounded-lg p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-6">Future Rides</h2>
            <div className="space-y-4">
              {futureRides.map((ride) => (
                <div key={ride.id} className="border-b pb-4 border-purple-300 dark:border-purple-700">
                  <p className="text-purple-800 dark:text-purple-200 font-medium">{ride.destination}</p>
                  <p className="text-purple-600 dark:text-purple-400">Date: {ride.date}</p>
                  <p className="text-purple-600 dark:text-purple-400">Time: {ride.time}</p>
                  <p className="text-purple-600 dark:text-purple-400">Seats Available: {ride.seatsAvailable}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-purple-800 shadow rounded-lg p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-6">User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Full Name</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Email</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Phone</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-600 dark:text-purple-400">Location</label>
              <p className="mt-1 text-purple-800 dark:text-purple-200">{userStats.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button className="bg-blue-500 dark:bg-blue-700 text-white dark:text-white px-6 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 transition duration-300">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;