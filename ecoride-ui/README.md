This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getAddressFromCoordinates } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

const BookingPage = ({ params }) => {

  console.log("rides and rides and", rideWithAddresses);
  return (
    <div className="p-4 pb-20 bg-gray-100 dark:bg-gray-900 min-h-screen flex justify-center  dark:text-w ">
      <div className="max-w-2xl w-full pb-14 hide-scrollbar overflow-y-scroll  ">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white ">Book Ride</h2>

        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {successMessage && (
          <div className="text-green-500 mb-4">{successMessage}</div>
        )}

        {rideWithAddresses && (
          <Card className="bg-white dark:bg-gray-800 shadow-lg border  border-gray-200 dark:border-gray-700  ">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100  hite">
                Ride Details
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Confirm your booking details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.startAddress}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">To:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.destinationAddress}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(rideWithAddresses.startTime).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>
                <p className="text-gray-900 dark:text-gray-100">
                  {new Date(rideWithAddresses.startTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Price per seat:</span>
                <p className="text-gray-900 dark:text-gray-100">${rideWithAddresses.farePerSeat}</p>
              </div>
              <div className="space-y-2">
                <span className="font-medium text-gray-700 dark:text-gray-300">Seats Available:</span>
                <p className="text-gray-900 dark:text-gray-100">{rideWithAddresses.totalSeatsAvailable}</p>
              </div>

              <div className="space-y-4 mt-6">
                <label htmlFor="seats" className="block text-sm   font-medium text-gray-700 dark:text-gray-300">
                  Number of Seats
                </label>
                <Input
                  type="number"
                  id="seats"
                  value={seatsToBook}
                  onChange={(e) => setSeatsToBook(parseInt(e.target.value, 10))}
                  min="1"
                  max={ride.totalSeatsAvailable}
                  placeholder="Enter number of seats"
                  className="mt-1 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-purple-400 dark:border-purple-600 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

              <Button
                onClick={handleBook}
                className="w-full bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Book Ride
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
