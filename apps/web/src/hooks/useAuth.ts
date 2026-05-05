import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { useAuthStore } from "@/store/useAuthStore";
import { RegisterInput, LoginInput, AuthResponse } from "@p2p/types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post<{
        success: boolean;
        data: AuthResponse;
      }>("/auth/login", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      router.push("/vehicles"); // Redirect to dashboard/marketplace
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await apiClient.post<{
        success: boolean;
        data: AuthResponse;
      }>("/auth/register", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data);
      router.push("/vehicles");
    },
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
