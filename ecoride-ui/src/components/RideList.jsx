// components/RideList.js
"use client";

const RideList = ({ rides }) => {
    if (!rides || rides.length === 0) {
        return <p>No rides available.</p>;
    }

    return (
        <ul className="space-y-2">
            {rides.map((ride) => (
                <li key={ride._id} className="border p-4 rounded-md shadow-sm">
                    <p>
                        <strong>Starting Point:</strong> {ride.startAddress || ride.startingPoint}
                    </p>
                    <p>
                        <strong>Destination:</strong> {ride.destinationAddress || ride.destination}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default RideList;