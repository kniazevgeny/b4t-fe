import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "./api.ts";
import type { CreateTaskDto, Task, UpdateTaskDto, ImproveDescriptionDto, ImproveDescriptionResponse, RefineQuizDto, AjtbdResponse } from "./types.ts";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<Task[]> => {
      const res = await apiFetch(`/tasks`);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to load tasks");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (dto: CreateTaskDto): Promise<{ id: string }> => {
      const res = await apiFetch(`/tasks`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to create task");
      return res.json();
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskDto }): Promise<{ id: string }> => {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to update task");
      return res.json();
    },
  });
}

export function useImproveDescription() {
  return useMutation({
    mutationFn: async (dto: ImproveDescriptionDto): Promise<ImproveDescriptionResponse> => {
      const res = await apiFetch(`/tasks/improve-description`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to improve description");
      return res.json();
    },
  });
}


export function useRefineQuiz() {
  return useMutation({
    mutationFn: async (dto: RefineQuizDto): Promise<AjtbdResponse> => {
      const res = await apiFetch(`/tasks/refine-ajtbd-quiz`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to refine AJTBD quiz");
      return res.json();
    },
  });
}


