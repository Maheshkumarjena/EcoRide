"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
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

// Mock data for demonstration.  In a real app, this would come from an API.
const mockBookings = {
    "123": {
        bookingId: "123",
        userId: "user1",
        rideId: "ride456",
        seats: 2,
        totalCost: 50.00,
        bookingDate: "2024-07-28",
        status: "confirmed", // "pending", "confirmed", "cancelled"
        paymentStatus: "paid", // "pending", "paid", "failed"
        pickupLocation: "Central Station",
        dropoffLocation: "Downtown Plaza",
        rideDate: "2024-08-01",
        rideTime: "6:00 PM",
        driverName: "Alice Smith",
        vehicle: "Toyota Camry",
        vehicleNumber: "ABC-123",
    },

    "456": {
        bookingId: "456",
        userId: "user2",
        rideId: "ride789",
        seats: 1,
        totalCost: 25.00,
        bookingDate: "2024-07-29",
        status: "pending",
        paymentStatus: "pending",
        pickupLocation: "Airport Terminal 3",
        dropoffLocation: "City Center",
        rideDate: "2024-08-02",
        rideTime: "10:00 AM",
        driverName: "Bob Johnson",
        vehicle: "Honda Civic",
        vehicleNumber: "XYZ-456",
    },
    "789": {
        bookingId: "789",
        userId: "user1",
        rideId: "ride111",
        seats: 3,
        totalCost: 75.00,
        bookingDate: "2024-07-30",
        status: "cancelled",
        paymentStatus: "refunded",
        pickupLocation: "University Campus",
        dropoffLocation: "Beachfront",
        rideDate: "2024-08-05",
        rideTime: "3:00 PM",
        driverName: "Charlie Brown",
        vehicle: "Ford Mustang",
        vehicleNumber: "DEF-789"
    }
};

const BookingConfirmationPage = () => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const bookingId=123;
    useEffect(() => {
        // if (!bookingId) {
        //     setError("Booking ID is missing.");
        //     setLoading(false);
        //     return;
        // }

        // Simulate fetching booking details from a server
        const fetchedBooking = mockBookings[bookingId];

        if (fetchedBooking) {
            setBooking(fetchedBooking);
        } else {
            setError(`Booking with ID "${bookingId}" not found.`);
        }
        setLoading(false);

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
        return null; // Should not reach here, but for type safety
    }

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "pending": return "secondary";
            case "confirmed": return "default";
            case "cancelled": return "destructive";
            default: return "outline";
        }
    };

    const getPaymentStatusBadgeVariant = (status) => {
        switch (status) {
            case "pending": return "secondary";
            case "paid": return "default";
            case "failed": return "destructive";
            case "refunded": return "destructive";
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
                            <p className="text-purple-800 dark:text-purple-200">{booking.bookingId}</p>
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
                            <p className="text-purple-800 dark:text-purple-200">{booking.seats}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                                <span className="font-semibold text-purple-700 dark:text-purple-300">Total Cost:</span>
                            </div>
                            <p className="text-purple-800 dark:text-purple-200">${booking.totalCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={getStatusBadgeVariant(booking.status)}
                                    className={cn(
                                        "px-3 py-1 rounded-full font-medium",
                                        booking.status === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
                                        booking.status === "confirmed" && "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                                        booking.status === "cancelled" && "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                                    )}
                                >
                                    Status: {booking.status}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={getPaymentStatusBadgeVariant(booking.paymentStatus)}
                                    className={cn(
                                        "px-3 py-1 rounded-full font-medium",
                                        booking.paymentStatus === "pending" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
                                        booking.paymentStatus === "paid" && "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
                                        (booking.paymentStatus === "failed" || booking.paymentStatus === "refunded") && "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
                                    )}
                                >
                                    Payment Status: {booking.paymentStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-purple-200 dark:border-purple-700 pt-6 mt-6">
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
                    </div>
                    <div className="mt-8">
                        <Button
                            variant="outline"
                            className="bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-600 border-purple-300 dark:border-purple-600"
                            onClick={() => {
                                //  navigation logic here (e.g., redirect to home)
                                alert('Navigating to home page (implementation needed)');
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
