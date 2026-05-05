import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { CreateBookingInput } from "@p2p/types";

export function useBookings() {
  const queryClient = useQueryClient();

  const getBookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await apiClient.get("/bookings");
      return response.data.data;
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: CreateBookingInput) => {
      const response = await apiClient.post("/bookings", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  return {
    bookings: getBookingsQuery.data,
    isLoadingBookings: getBookingsQuery.isLoading,
    createBooking: createBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    error: createBookingMutation.error,
  };
}
