import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export interface Vehicle {
  id: string;
  type: "CAR" | "BIKE";
  make: string;
  model: string;
  year: number;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  ownerId: string;
  media: { id: string; url: string; type: string }[];
  owner: { id: string; firstName: string; createdAt: string };
}

export function useVehicles(filters?: {
  type?: "CAR" | "BIKE";
  isAvailable?: boolean;
}) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: async () => {
      const response = await apiClient.get<{
        success: boolean;
        data: Vehicle[];
      }>("/vehicles", { params: filters });
      return response.data.data;
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Vehicle }>(
        `/vehicles/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
}
