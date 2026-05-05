"use client";

import { useBookings } from "@/hooks/useBookings";
import { useAuthStore } from "@/store/useAuthStore";

export function BookingList() {
  const { bookings, isLoadingBookings } = useBookings();
  const { user } = useAuthStore();

  if (isLoadingBookings)
    return (
      <div className="animate-pulse h-40 bg-muted rounded-md w-full"></div>
    );
  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-card">
        <h3 className="font-semibold mb-1">No trips yet</h3>
        <p className="text-muted-foreground text-sm">
          When you book a vehicle, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => {
        const isOwner = user?.id === booking.vehicle.ownerId;
        const statusColors: any = {
          PENDING: "bg-yellow-100 text-yellow-800",
          CONFIRMED: "bg-green-100 text-green-800",
          CANCELLED: "bg-red-100 text-red-800",
          COMPLETED: "bg-blue-100 text-blue-800",
        };

        return (
          <div
            key={booking.id}
            className="p-4 border rounded-lg bg-card flex flex-col md:flex-row justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${statusColors[booking.status]}`}
                >
                  {booking.status}
                </span>
                {isOwner && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
                    You are the Owner
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-lg">
                {booking.vehicle.make} {booking.vehicle.model}
              </h4>
              <p className="text-sm text-muted-foreground">
                {new Date(booking.startTime).toLocaleDateString()} to{" "}
                {new Date(booking.endTime).toLocaleDateString()}
              </p>
              <div className="text-sm mt-2">
                <span className="font-medium">Total:</span> $
                {booking.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
