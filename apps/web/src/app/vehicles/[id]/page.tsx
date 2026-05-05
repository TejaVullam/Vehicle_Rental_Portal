"use client";

import { useVehicle } from "@/hooks/useVehicles";
import { BookingWidget } from "@/components/bookings/BookingWidget";
import { Button } from "@/components/ui/button";
import {
  Car,
  Bike,
  MapPin,
  Star,
  User,
  Calendar,
  Shield,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function VehicleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: vehicle, isLoading, error } = useVehicle(params.id);

  if (isLoading) {
    return (
      <div className="container py-10 animate-pulse space-y-8">
        <div className="h-8 w-32 bg-muted rounded-md mb-6"></div>
        <div className="h-[400px] w-full bg-muted rounded-2xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-12 w-3/4 bg-muted rounded-md"></div>
            <div className="h-24 w-full bg-muted rounded-md"></div>
          </div>
          <div className="h-[400px] w-full bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Vehicle Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/vehicles">Back to Browse</Link>
        </Button>
      </div>
    );
  }

  const coverImage =
    vehicle.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="container py-6">
        <Link
          href="/vehicles"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all rides
        </Link>

        {/* Hero Image */}
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden mb-8 shadow-md">
          <img
            src={coverImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  {vehicle.type === "CAR" ? (
                    <Car className="w-3.5 h-3.5" />
                  ) : (
                    <Bike className="w-3.5 h-3.5" />
                  )}
                  {vehicle.type}
                </span>
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  4.9 (24 trips)
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                {vehicle.make} {vehicle.model}{" "}
                <span className="text-muted-foreground font-medium">
                  {vehicle.year}
                </span>
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground font-medium mt-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span>San Francisco, CA (Mocked Location)</span>
              </div>
            </div>

            <hr className="border-border" />

            {/* Host Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                {vehicle.owner?.firstName?.[0] || "U"}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Hosted by {vehicle.owner?.firstName || "A Verified Owner"}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm mt-0.5">
                  <Shield className="w-4 h-4 text-green-500" /> Identity
                  verified
                </p>
              </div>
            </div>

            <hr className="border-border" />

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                About this {vehicle.type.toLowerCase()}
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </div>
            </div>

            <hr className="border-border" />

            {/* Features (Mocked for UI purposes) */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                {[
                  "Automatic transmission",
                  "Bluetooth",
                  "USB Input",
                  "Backup camera",
                  "Heated seats",
                  "Sunroof",
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Widget Sidebar (Right) */}
          <div className="lg:col-span-1">
            <BookingWidget vehicle={vehicle} />
          </div>
        </div>
      </div>
    </div>
  );
}
