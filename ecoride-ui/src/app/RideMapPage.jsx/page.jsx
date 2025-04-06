import RideMap from "@/components/RideMap";

const RideMapPage = () => {
  const start = { lat: 28.7041, lng: 77.1025 }; // Example: Delhi
  const end = { lat: 19.076, lng: 72.8777 }; // Example: Mumbai

  return (
    <div>
      <h1>Find a Ride</h1>
      <RideMap start={start} end={end} />
    </div>
  );
};

export default RideMapPage;