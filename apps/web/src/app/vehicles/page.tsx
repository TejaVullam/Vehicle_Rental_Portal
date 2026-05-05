"use client";

import { useState } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { Button } from "@/components/ui/button";

export default function VehiclesFeedPage() {
  const [filter, setFilter] = useState<"ALL" | "CAR" | "BIKE">("ALL");

  const queryFilter = filter === "ALL" ? {} : { type: filter };
  const { data: vehicles, isLoading, error } = useVehicles(queryFilter);

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Rides</h1>
          <p className="text-muted-foreground mt-1">
            Find the perfect vehicle for your next journey.
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-lg">
          <Button
            variant={filter === "ALL" ? "default" : "ghost"}
            onClick={() => setFilter("ALL")}
            className="rounded-md"
          >
            All
          </Button>
          <Button
            variant={filter === "CAR" ? "default" : "ghost"}
            onClick={() => setFilter("CAR")}
            className="rounded-md"
          >
            Cars
          </Button>
          <Button
            variant={filter === "BIKE" ? "default" : "ghost"}
            onClick={() => setFilter("BIKE")}
            className="rounded-md"
          >
            Bikes
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-[350px] rounded-lg bg-muted animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-destructive/10 rounded-lg text-destructive">
          <p className="font-medium">Failed to load vehicles.</p>
          <p className="text-sm opacity-80 mt-1">Please try again later.</p>
        </div>
      ) : vehicles?.length === 0 ? (
        <div className="text-center py-20 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No vehicles found</h3>
          <p className="text-muted-foreground mt-1">
            Try changing your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles?.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
