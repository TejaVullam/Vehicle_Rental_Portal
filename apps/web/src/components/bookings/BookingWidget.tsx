"use client";

import { useState, useMemo } from "react";
import { useBookings } from "@/hooks/useBookings";
import { useAuthStore } from "@/store/useAuthStore";
import { Vehicle } from "@/hooks/useVehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface BookingWidgetProps {
  vehicle: Vehicle;
}

export function BookingWidget({ vehicle }: BookingWidgetProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { createBooking, isCreating, error } = useBookings();

  // Initialize with tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0); // 10 AM Default

  const nextDay = new Date(tomorrow);
  nextDay.setDate(nextDay.getDate() + 1);

  // Format for datetime-local input: YYYY-MM-DDThh:mm
  const formatForInput = (d: Date) => d.toISOString().slice(0, 16);

  const [startDate, setStartDate] = useState(formatForInput(tomorrow));
  const [endDate, setEndDate] = useState(formatForInput(nextDay));
  const [bookingError, setBookingError] = useState<string | null>(null);

  const calculatePrice = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (end <= start) return 0;

    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    if (hours < 24) {
      return hours * vehicle.pricePerHour;
    } else {
      const days = Math.ceil(hours / 24);
      return days * vehicle.pricePerDay;
    }
  }, [startDate, endDate, vehicle.pricePerHour, vehicle.pricePerDay]);

  const handleBooking = async () => {
    setBookingError(null);

    if (!isAuthenticated) {
      router.push(`/login?redirect=/vehicles/${vehicle.id}`);
      return;
    }

    if (user?.id === vehicle.ownerId) {
      setBookingError("You cannot book your own vehicle.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setBookingError("End date must be after start date.");
      return;
    }

    try {
      await createBooking({
        vehicleId: vehicle.id,
        // Convert local datetime to ISO string for the backend
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      // Redirect to profile/bookings page after success (to be built)
      router.push("/profile?tab=bookings&success=true");
    } catch (err: any) {
      setBookingError(
        err.response?.data?.message || "Failed to create booking.",
      );
    }
  };

  const isOwner = user?.id === vehicle.ownerId;

  return (
    <Card className="sticky top-24 border-primary/20 shadow-md">
      <CardHeader>
        <CardTitle>Reserve this {vehicle.type}</CardTitle>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-extrabold text-primary">
            ${vehicle.pricePerDay}
          </span>
          <span className="text-muted-foreground font-medium">/ day</span>
        </div>
        <p className="text-sm text-muted-foreground">
          or ${vehicle.pricePerHour} / hour
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {(error || bookingError) && (
          <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              {bookingError ||
                (error as any)?.response?.data?.message ||
                "An error occurred"}
            </span>
          </div>
        )}

        <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-1.5">
            <Label htmlFor="pickup">Pickup Date & Time</Label>
            <Input
              id="pickup"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="return">Return Date & Time</Label>
            <Input
              id="return"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        {calculatePrice > 0 && (
          <div className="flex justify-between items-center py-2 px-1 border-t mt-4">
            <span className="font-medium">Total Price</span>
            <span className="text-xl font-bold">
              ${calculatePrice.toFixed(2)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {isOwner ? (
          <Button variant="secondary" className="w-full" disabled>
            This is your vehicle
          </Button>
        ) : (
          <Button
            className="w-full text-lg h-12"
            onClick={handleBooking}
            disabled={isCreating || !vehicle.isAvailable || calculatePrice <= 0}
          >
            {isCreating
              ? "Confirming..."
              : !vehicle.isAvailable
                ? "Not Available"
                : "Book Now"}
          </Button>
        )}
      </CardFooter>
      <div className="px-6 pb-4 text-center">
        <p className="text-xs text-muted-foreground">
          You won't be charged yet
        </p>
      </div>
    </Card>
  );
}
