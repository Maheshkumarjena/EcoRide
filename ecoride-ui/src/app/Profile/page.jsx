"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Edit,
  CheckCircle,
  AlertTriangle,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils"

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(userStats);
  const [saveSuccessful, setSaveSuccessful] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(true); //  for demonstration

  useEffect(() => {
    //  API calls (mocked here)
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
        setEditedUser((prev) => ({ ...prev, ...response.data })); // Initialize editedUser
      })
      .catch(() => {
        setUserStats((prev) => ({
          ...prev,
          ridesProvided: 5,
          ridesUsed: 8,
          averageRating: 4.5,
        }));
        setEditedUser((prev) => ({
          ...prev,
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 234 567 890",
          location: "New York, USA",
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserStats(editedUser); // Update user stats
    setIsEditing(false);
    setSaveSuccessful(true);
    setTimeout(() => setSaveSuccessful(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(userStats); // Reset to original data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="text-center py-8 text-purple-800 dark:text-purple-200">Loading...</div>;
  }

  return (
    <div className="min-h-screen overflow-y-scroll pb-30 py-8 text-purple-800 dark:text-purple-200">
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
            {isOwnProfile && ( // Show Edit Profile button only for own profile
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="absolute top-4 right-4 bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-600 border-purple-300 dark:border-purple-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700">
                  <DialogHeader>
                    <DialogTitle className="text-purple-900 dark:text-purple-100">Edit Profile</DialogTitle>
                    <DialogDescription className="text-purple-600 dark:text-purple-400">
                      Make changes to your profile information below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="fullName" className="text-right text-purple-700 dark:text-purple-300">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={editedUser.fullName}
                        onChange={handleChange}
                        className="col-span-3 bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right text-purple-700 dark:text-purple-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={editedUser.email}
                        onChange={handleChange}
                        className="col-span-3 bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right text-purple-700 dark:text-purple-300">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={editedUser.phone}
                        onChange={handleChange}
                        className="col-span-3 bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right text-purple-700 dark:text-purple-300">
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={editedUser.location}
                        onChange={handleChange}
                        className="col-span-3 bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="bio" className="text-right mt-2 text-purple-700 dark:text-purple-300">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editedUser.bio}
                        onChange={handleChange}
                        className="col-span-3 bg-purple-100 dark:bg-purple-700 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600 min-h-[100px]"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
        {saveSuccessful && (
          <div className="mt-4 text-green-500 flex items-center gap-2 justify-center">
            <CheckCircle className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
