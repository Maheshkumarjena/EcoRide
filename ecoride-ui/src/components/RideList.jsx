// components/RideList.js
"use client";
import Link from "next/link";

const RideList = ({ rides }) => {
    if (!rides || rides.length === 0) {
        return <p>No rides available.</p>;
    }

    return (
        <ul className="space-y-2 mt-4">
            {rides.map((ride) => (
                <li
                key={ride._id}
                className="border p-4 rounded-md shadow-sm flex items-center justify-between  transition-colors"
            >
                <div>
                    <p>
                        {ride.startAddress || ride.startingPoint} to {ride.destinationAddress || ride.destination}
                    </p>
                </div>
                <div>
                    <Link href={`/Ride/${ride._id}`}>
                        <button
                            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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