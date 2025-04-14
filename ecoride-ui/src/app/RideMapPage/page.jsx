'use client'
import dynamic from "next/dynamic";

const DynamicRideMap = dynamic(() => import("@/components/Ride-map"), {
  ssr: false,
});

const RideMapPage = () => {
  const start = { lat: 28.7041, lng: 77.1025 }; // Example: Delhi
  const end = { lat: 19.076, lng: 72.8777 }; // Example: Mumbai

  return (
    <div>
      <h1>Find a Ride</h1>
      <DynamicRideMap start={start} end={end} />
    </div>
  );
};

export default RideMapPage;