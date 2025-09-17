import { useMutation, useQuery } from "@tanstack/react-query";
import type { UpdateProfileDto, User } from "./types.ts";
import { apiFetch, refreshToken } from "./api.ts";
import { queryClient } from "@/routes/__root";

export function useProfile(silent?: boolean) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<User> => {
      const response = await apiFetch(`/profile`);

      if (response.status === 401 && !silent) {
        await refreshToken();
        // signal to retry logic
        throw new Error("Unauthorized");
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load profile");
      }

      return await response.json();
    },
    retry(failureCount, error) {
      if (silent) return false;

      if (window.location.pathname.slice(0, 6) === "/login") return false;
      if (failureCount >= 1 && error.message === "Unauthorized") {
        window.history.pushState(
          {},
          "",
          "/login?next=" + window.location.pathname
        );
        return false;
      }
      return true;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (profileData: UpdateProfileDto): Promise<User> => {
      const response = await apiFetch(`/profile`, {
        method: "PATCH",
        body: JSON.stringify(profileData),
      });

      if (response.status === 401) {
        refreshToken();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });
}

// Video upload hook removed – not part of current API surface

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<User> => {
      const response = await apiFetch(`/profile/${userId}`);

      if (response.status === 401) {
        refreshToken();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        if (response.status === 500) throw new Error("Server error");
        throw new Error("Failed to load user profile");
      }

      return await response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
