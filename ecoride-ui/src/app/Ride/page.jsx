"use client";
import React, { useRef, useState } from "react";
import CreateRide from "@/components/CreateRide";
import FindRide from "@/components/FindRide";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";


const RidePage = () => {
    const [activeTab, setActiveTab] = useState("create");
    const [user, setUser] = useState(null);
    const router = useRouter();

    const effectRan = useRef(false); // Initialize ref to false

    useEffect(() => {
        if (effectRan.current === false) {

            const storedUser = localStorage.getItem('user');
            console.log('user from local storage', storedUser)

            if (storedUser) {
                const userData = JSON.parse(storedUser);
                console.log('user data from local storage', userData)
                const currentTime = Date.now();

                if (userData.expiration && currentTime < userData.expiration) {
                    setUser(userData);
                } else {
                    localStorage.removeItem('user');
                    router.push('/SignIn');
                }
            } else {
                toast.info('You are not logged in !');
                router.push('/SignIn');
            }
            effectRan.current = true;
        }
    }, [router]);

    return (
        <div className="flex flex-col h-screen bg-purple-100 dark:bg-gray-900">
        <div className="bg-purple-300 dark:bg-purple-800 w-full shadow-md py-2 flex justify-center space-x-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 font-medium transition-all text-lg rounded-md border-2 ${
              activeTab === "create"
                ? "bg-purple-600 text-white shadow-lg border-purple-600"
                : "text-purple-800 hover:bg-purple-500 hover:text-white border-purple-400 dark:text-purple-300"
            } transform hover:scale-105 active:scale-95`}
          >
            Create Ride
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`px-6 py-2 font-medium transition-all text-lg rounded-md border-2 ${
              activeTab === "find"
                ? "bg-purple-600 text-white shadow-lg border-purple-600"
                : "text-purple-800 hover:bg-purple-500 hover:text-white border-purple-400 dark:text-purple-300"
            } transform hover:scale-105 active:scale-95`}
          >
            Find Ride
          </button>
        </div>
      
        <div className="w-full flex-grow overflow-y-auto hide-scrollbar">
          {activeTab === "create" ? <CreateRide /> : <FindRide />}
        </div>
      </div>
    );
};

export default RidePage;