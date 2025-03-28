// pages/ride/[id].jsx (or [id].js)
"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import { getAddressFromCoordinates } from '@/lib/utils';
import { getAddressCoordinates } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button" // Using shadcn/ui Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card" // Using shadcn/ui Card
import { Badge } from "@/components/ui/badge" // Using shadcn/ui Badge
import { Skeleton } from "@/components/ui/skeleton" // Using shadcn/ui Skeleton
import { getDistanceTime } from '@/lib/utils';


const RideMap = dynamic(() => import("@/components/Ride-map"), { ssr: false });

const RideDetailPage = ({ params }) => {

  const MAP_URL = process.env.NEXT_PUBLIC_RAPHHOPPER_API_KEY
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [stops, setStops] = useState(null);
  const [via, setVia] = useState(null);
  const [distance,setDistance]=useState(null);
  const [time,setTime]=useState(null);

  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";



  useEffect(() => {
    if (!id) return;

    const fetchRideAndGetCoords = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/rides/${id}`, {
          withCredentials: true,
        });

        const startCoords = response.data.ride.startingPoint.coordinates;
        const destCoords = response.data.ride.destination.coordinates;

        const startAddress = await getAddressFromCoordinates(startCoords.lat, startCoords.lng, MAP_URL);
        const destinationAddress = await getAddressFromCoordinates(destCoords.lat, destCoords.lng, MAP_URL);

        const rideDetail = {
          ...response.data.ride,
          startAddress,
          destinationAddress,
        };

        setRide(rideDetail);

        // Extract start and end coordinates
        const startPoint = {
          lat: rideDetail.startingPoint.coordinates.lat,
          lng: rideDetail.startingPoint.coordinates.lng,
        };
        const endPoint = {
          lat: rideDetail.destination.coordinates.lat,
          lng: rideDetail.destination.coordinates.lng,
        };

        // Fetch coordinates for stops
        const stopsCoords = rideDetail.stops
          ? await Promise.all(
              rideDetail.stops.map(async (stop) => {
                const coords = await getAddressCoordinates(stop, MAP_URL);
                return { lat: coords.lat, lng: coords.lng };
              })
            )
          : [];

        setStart(startPoint);
        setEnd(endPoint);
        setStops(stopsCoords);

        console.log('stop at dynamic ride detail page ========>', stopsCoords);

        // Fetch distance and time after setting start, stops, and end
        if (startPoint && endPoint) {
          try {
            const data = await getDistanceTime(startPoint, stopsCoords, endPoint);
            console.log('distance time data =============>', data);
            setDistance(data.distance);
            setTime(data.time);
          } catch (error) {
            console.error('Error in getDistanceTime:', error);
          }
        } else {
          console.log('start or end is null');
        }

      } catch (err) {
        setError(err.message || 'Failed to fetch ride details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRideAndGetCoords();
  }, [id]);
  




  if (loading) return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        <Skeleton className="h-8 w-64 mb-4" />
      </h1>
      <div className="lg:flex lg:space-x-8">
        {/* Ride Details Section */}
        <Card className="lg:flex-1">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-10 w-32 mt-4" />
          </CardContent>
        </Card>

        {/* Ride Map Section */}
        <Card className="lg:flex-1">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen ">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-6 text-red-500 dark:text-red-400">
          Error
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">{error}</p>
        <Button
          onClick={() => router.back()}
          className="mt-6 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Back
        </Button>
      </div>
    </div>
  );

  if (!ride) return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Ride Not Found
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Sorry, the ride you are looking for could not be found.
      </p>
      <Button
        onClick={() => router.back()}
        className="mt-6 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        Back
      </Button>
    </div>
  );

  // Helper function to render coordinates or address
  const renderLocation = (location) => {
    if (typeof location === 'object' && location !== null) {
      if (location.coordinates) {
        return `Lat: ${location.coordinates[0]}, Lng: ${location.coordinates[1]}`;
      }
      return JSON.stringify(location);
    }
    return location;
  };





  return (
    <div className="p-4 bg-purple-100 dark:bg-gray-900 min-h-screen overflow-y-scroll hide-scrollbar pb-30">
    <h1 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-200">
      Ride Details
    </h1>
    <div className="lg:flex lg:space-x-8">
      {/* Ride Details Section */}
      <Card className="lg:flex-1 bg-white dark:bg-gray-800 shadow-lg border border-purple-300 dark:border-purple-600">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-purple-800 dark:text-purple-200">
            Ride Information
          </CardTitle>
          <CardDescription className="text-purple-500 dark:text-purple-400">
            Details about the selected ride
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Starting Point:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {ride.startAddress || renderLocation(ride.startingPoint)}
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Destination:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {ride.destinationAddress || renderLocation(ride.destination)}
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Fare Per Seat:
            </span>
            <p className="text-purple-800 dark:text-purple-200">₹ {ride.farePerSeat}</p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Vehicle Type:  
            </span>
            <Badge
              variant="secondary"
              className="bg-purple-200 ml-2 dark:bg-purple-800 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700"
            >
              { ride.vehicleType}
            </Badge>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Total Seats Available:
            </span>
            <p className="text-purple-800 dark:text-purple-200">{ride.totalSeatsAvailable}</p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Start Time:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {new Date(ride.startTime).toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Duration:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {time ? `${(time/60).toFixed(2)} Hrs` : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Distance:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {distance ? `${distance.toFixed(2)} Km` : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Ride Status:
            </span>
            <Badge
              variant="outline"
              className={
                ride.rideStatus === 'available'
                  ? "text-green-500 ml-2 dark:text-green-400 border-green-500 dark:border-green-400"
                  : "text-red-500 ml-2 dark:text-red-400 border-red-500 dark:border-red-400"
              }
            >
              {ride.rideStatus}
            </Badge>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-purple-700 dark:text-purple-300">
              Stops:
            </span>
            <p className="text-purple-800 dark:text-purple-200">
              {ride.stops ? ride.stops.join(', ') : 'No stops'}
            </p>
          </div>
          {/* Render riders if needed */}
          {ride.riders && ride.riders.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
                Riders
              </h3>
              <div className="space-y-4">
                {ride.riders.map((rider, index) => (
                  <Card key={index} className="bg-purple-50 dark:bg-gray-700 border border-purple-300 dark:border-purple-600">
                  <CardContent className="space-y-2">
                    <p className="text-purple-800 dark:text-purple-200">
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        User:
                      </span>{" "}
                      {rider.user?.toString()}
                    </p>
                    <p className="text-purple-800 dark:text-purple-200">
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        Seats Booked:
                      </span>{" "}
                      {rider.seatsBooked}
                    </p>
                    <p className="text-purple-800 dark:text-purple-200">
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        Payment Status:
                      </span>{" "}
                      {rider.paymentStatus}
                    </p>
                    <p className="text-purple-800 dark:text-purple-200">
                      <span className="font-medium text-purple-700 dark:text-purple-300">
                        Status:
                      </span>{" "}
                      {rider.status}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-start space-x-4 mt-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="bg-purple-300 dark:bg-gray-700 text-purple-700 dark:text-purple-300 hover:bg-purple-400 dark:hover:bg-gray-600"
          >
            Back
          </Button>
          <Link href={`/Booking/${ride._id}`}>
            <Button
              className="bg-purple-500 dark:bg-purple-600 text-white hover:bg-purple-600 dark:hover:bg-purple-700"
            >
              Book Ride
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>

    {/* Ride Map Section */}
    <Card className="lg:flex-1 mt-6 lg:mt-0 bg-white dark:bg-gray-800 h-fit shadow-lg border border-purple-300 dark:border-purple-600">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-purple-800 dark:text-purple-200">
          Ride Map
        </CardTitle>
        <CardDescription className="text-purple-500 dark:text-purple-400">
          Route and location details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md w-full overflow-hidden border border-purple-300 dark:border-purple-600">
          <RideMap start={start} end={end} stops={stops} via={via} className="h-[400px] w-[100%] p-0 sm:p-auto" />
        </div>
      </CardContent>
    </Card>
  </div>
</div>
  );
};

export default RideDetailPage;
