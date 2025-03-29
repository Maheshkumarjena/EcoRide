"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useRouter } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    CheckCircle,
    AlertTriangle,
    Loader2,
    MapPin,
    Calendar,
    Clock,
    Users,
    CreditCard,
    Info
} from 'lucide-react';
import { cn } from "@/lib/utils"

const BookingConfirmationPage = () => {
    const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "https://ecoride-m6zs.onrender.com";
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { bookingId } = useParams();
    const [booking,setBooking]=useState(null);

    console.log("received booking Id ================>", bookingId);

   
    useEffect(() => {
        if (!bookingId) {
            setError("Rider ID is missing.");
            setLoading(false);
            return;
        }

        const fetchRider = async () => {
            try {
                const response = await axios.get(`${API_URL}/bookings/getBooking/${bookingId}`);
                console.log(
                    "getting rider at booking details page======================> ",
                    response 
                )
                setBooking(response.data);
            } catch (err) {
                console.log(err)
                setError(err.response?.data?.message || "Failed to fetch rider details.");
            } finally {
                setLoading(false);
            }
        };

        fetchRider();
    }, [bookingId]);

    if (loading) { 
        return (
            <div className="flex items-center justify-center h-screen text-purple-800 dark:text-purple-200">
                <Loader2 className="animate-spin w-10 h-10 mr-3" />
                Fetching booking details...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 dark:text-red-400">
                <AlertTriangle className="w-8 h-8 mr-3" />
                {error}
            </div>
        );
    }

    if (!booking) {
        return null;
        console.log("booking null")
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "pending_otp": return "secondary";
            case "in_progress": return "default";
            case "completed": return "destructive";
            case "cancelled": return "destructive";
            case "confirmed": return "default";
            default: return "outline";
        }
    };

    const getPaymentStatusBadgeVariant = (status) => {
        switch (status) {
            case "pending": return "secondary";
            case "paid": return "default";
            case "hold": return "destructive";
            case "released": return "destructive";
            default: return "outline";
        }
    };

    return (
        <div className="min-h-[90vh] bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 overflow-y-scroll  pb-[11vh] py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6 text-purple-900 dark:text-purple-100">
                    Booking Confirmation
                </h1>

                <Card className="bg-white dark:bg-purple-800 shadow-lg border border-purple-200 dark:border-purple-700">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                            Booking Details
                            {booking.status === 'confirmed' && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </CardTitle>
                        <CardDescription className="text-purple-600 dark:text-purple-400">
                            Your booking has been {booking.status}.  Here are the details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Info className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Booking ID:</span>
                                </div>
                                <p className="text-purple-800 dark:text-purple-200">{booking.rider._id}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Booking Date:</span>
                                </div>
                                <p className="text-purple-800 dark:text-purple-200">{booking.bookingDate}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Seats:</span>
                                </div>
                                <p className="text-purple-800 dark:text-purple-200">{booking.rider.seatsBooked}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Total Cost:</span>
                                </div>
                                <p className="text-purple-800 dark:text-purple-200">₹ {booking.ride.farePerSeat*booking.rider.seatsBooked}</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={getStatusBadgeVariant(booking.rider.status)}
                                        className={cn(
                                            "px-3 py-1 rounded-full font-medium",
                                            booking.rider.status === "pending_otp" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
                                            booking.rider.status === "confirmed" && "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                                            booking.rider.status === "cancelled" && "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                                        )}
                                    >
                                        Status: {booking.rider.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant={getPaymentStatusBadgeVariant(booking.rider.paymentStatus)}
                                        className={cn(
                                            "px-3 py-1 rounded-full font-medium",
                                            booking.rider.paymentStatus === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
                                            booking.rider.paymentStatus === "paid" && "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                                            (booking.rider.paymentStatus === "hold" || booking.rider.paymentStatus === "refunded") && "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                                        )}
                                    >
                                        Payment Status: {booking.rider.paymentStatus}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* <div className="border-t border-purple-200 dark:border-purple-700 pt-6 mt-6">
                            <h3 className="text-xl font-semibold mb-4 text-purple-900 dark:text-purple-100">Ride Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-700 dark:text-purple-300">Pickup Location:</span>
                                    </div>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.pickupLocation}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-700 dark:text-purple-300">Dropoff Location:</span>
                                    </div>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.dropoffLocation}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-700 dark:text-purple-300">Ride Date:</span>
                                    </div>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.rideDate}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-700 dark:text-purple-300">Ride Time:</span>
                                    </div>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.rideTime}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Driver Name:</span>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.driverName}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-purple-700 dark:text-purple-300">Vehicle:</span>
                                    <p className="text-purple-800 dark:text-purple-200">{booking.vehicle} ({booking.vehicleNumber})</p>
                                </div>
                            </div>
                        </div> */}
                        <div className="mt-8">
                            <Button
                                variant="outline"
                                className="bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-600 border-purple-300 dark:border-purple-600"
                                onClick={() => {
                                    router.push('/');

                                }}
                            >
                                Go to Homepage
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BookingConfirmationPage;


