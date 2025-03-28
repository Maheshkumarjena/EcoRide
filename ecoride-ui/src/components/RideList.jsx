"use client";
import Link from "next/link";
import { format } from 'date-fns';

const RideList = ({ rides }) => {
  if (!rides || rides.length === 0) {
    return <p className="text-gray-700 dark:text-gray-300">No rides available.</p>;
  }
  console.log("ride at rideList=======================>", rides);

  let seats=0
  const seatsAvailable= rides.map((ride) => ride?.riders?.seatsBooked ? seats+=ride.riders.seatsBooked : seats+=0);
  console.log("seatsAvailable",rides[0]?.riders[0]?.seatsBooked);

  return (
    <ul className="space-y-2 mt-4">
      {rides.map((ride) => (
        <li
          key={ride._id}
          className="border p-4 rounded-md shadow-sm flex items-center justify-between transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col">
            <p className="text-gray-800 dark:text-gray-200">
              {ride.startAddress || ride.startingPoint} to {ride.destinationAddress || ride.destination}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {format(new Date(ride.startTime), 'MMM dd, yyyy HH:mm')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Price: ₹ {ride.farePerSeat}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Seats Available: { ride.totalSeatsAvailable > 0    ? ride.totalSeatsAvailable : "NA"}
            </p>
          </div>
          <div>
            <Link href={`/Ride/${ride._id}`}>
              <button
                className="bg-blue-500 cursor-pointer hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                aria-label={`View details for ride ${ride.startAddress || ride.startingPoint} to ${ride.destinationAddress || ride.destination}`}
              >
                View Details
              </button>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RideList;