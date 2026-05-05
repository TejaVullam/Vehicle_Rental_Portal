import Link from "next/link";
import { Vehicle } from "@/hooks/useVehicles";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Car, Bike, MapPin, Star } from "lucide-react";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  // Use generic fallback if no media exists
  const coverImage =
    vehicle.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=600&auto=format&fit=crop";

  return (
    <Link href={`/vehicles/${vehicle.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full flex flex-col">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm">
            ${vehicle.pricePerDay} / day
          </div>
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
            {vehicle.type === "CAR" ? (
              <Car className="w-3 h-3" />
            ) : (
              <Bike className="w-3 h-3" />
            )}
            {vehicle.type}
          </div>
        </div>

        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg line-clamp-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground">{vehicle.year}</p>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium dark:bg-yellow-900 dark:text-yellow-100">
              <Star className="w-3 h-3 fill-current" />
              <span>4.9</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-1">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">San Francisco, CA (Mocked)</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t flex justify-between items-center mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {vehicle.owner?.firstName?.[0] || "U"}
            </div>
            <span className="text-sm font-medium">
              {vehicle.owner?.firstName || "Host"}
            </span>
          </div>
          <div className="text-sm font-medium text-primary">
            ${vehicle.pricePerHour}/hr
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
