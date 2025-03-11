"use client"; // Ensure this is a Client Component

import dynamic from "next/dynamic";
import React from 'react';

const RideMap = dynamic(() => import("@/components/Ride-map"), { ssr: false });

const RideRoute = () => {

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Ride Route with Stops and Via Points</h1>
      <RideMap start={start} end={end} stops={stops} via={via} />
    </div>
  );
};

export default RideRoute;