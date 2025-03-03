"use client";
import React, { useState } from "react";
import CreateRide from "@/components/CreateRide";
import FindRide from "@/components/FindRide";

const RidePage = () => {
    const [activeTab, setActiveTab] = useState("create");

    return (
        <div className="flex flex-col h-screen ">
            <div className="bg-purple-300 dark:bg-purple-800 w-full shadow-md py-2 flex justify-center space-x-6">
                <button
                    onClick={() => setActiveTab("create")}
                    className={`px-6 py-2 font-medium transition-all text-lg rounded-md border-2 ${
                        activeTab === "create"
                            ? "bg-purple-600 text-white shadow-lg border-purple-600"
                            : "text-gray-700 hover:bg-purple-500 hover:text-white border-gray-400 dark:text-purple-300"
                    } transform hover:scale-105 active:scale-95`}
                >
                    Create Ride
                </button>
                <button
                    onClick={() => setActiveTab("find")}
                    className={`px-6 py-2 font-medium transition-all text-lg rounded-md border-2 ${
                        activeTab === "find"
                            ? "bg-purple-600 text-white shadow-lg border-purple-600"
                            : "text-gray-700 hover:bg-purple-500 hover:text-white border-gray-400 dark:text-purple-300"
                    } transform hover:scale-105 active:scale-95`}
                >
                    Find Ride
                </button>
            </div>

            <div className="w-full flex-grow overflow-y-auto">
                {activeTab === "create" ? <CreateRide /> : <FindRide />}
            </div>
        </div >
    );
};

export default RidePage;