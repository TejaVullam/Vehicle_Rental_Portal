import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { CreateBookingInput } from "@p2p/types";

export function useBookings() {
  const queryClient = useQueryClient();

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
    createBooking: createBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    error: createBookingMutation.error,
  };
}
