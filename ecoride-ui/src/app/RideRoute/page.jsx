"use client"; // Ensure this is a Client Component

import dynamic from "next/dynamic";
import React from 'react';

const RideMap = dynamic(() => import("@/components/Ride-map"), { ssr: false });

const RideRoute = ({start , end , stops , via}) => {
  // const start = { lat: 20.342265, lng: 85.819937 };
  // const end = { lat: 20.234124, lng: 85.814959 };
  // const stops = [
  //   { lat: 20.3013, lng: 85.8239 }, // Example stop 1
  //   { lat: 20.2854, lng: 85.8301 }, // Example stop 2
  // ];
  // const via = [
  //   { lat: 20.3200, lng: 85.8200 }, // Example via point 1
  //   { lat: 20.2500, lng: 85.8150 }, // Example via point 2
  // ];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Ride Route with Stops and Via Points</h1>
      <RideMap start={start} end={end} stops={stops} via={via} />
    </div>
  );
};

export default RideRoute;