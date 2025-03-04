"use client"; // Ensure this is a Client Component

import dynamic from "next/dynamic";

const RideMap=dynamic(()=>import("@/components/Ride-map"),{ssr:false,}); // ✅ No `ssr: false`)
// const RideMap = dynamic(() => import(@)); // ✅ No `ssr: false`

const RideRoute = () => {
  const start = { lat:20.342265  , lng: 85.819937  }; // Delhi
  const end = { lat:  20.234124, lng:85.814959  }; // Mumbai

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Find a Ride</h1>
      <RideMap start={start} end={end} />
    </div>
  );
};

export default RideRoute;
