import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api.ts";
import type { Project, CreateProjectDto, UpdateProjectDto } from "../utils/types.ts";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async (): Promise<Project[]> => {
      const res = await apiFetch(`/projects`);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to load projects");
      return res.json();
    },
    staleTime: 60_000,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async (): Promise<Project> => {
      const res = await apiFetch(`/projects/${id}`);
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to load project");
      return res.json();
    },
    staleTime: 60_000,
    enabled: !!id,
  });
}

export function useProjectWithTasks(id: string) {
  return useProject(id); // Alias for getById with full relations
}

export function useCreateProject() {
  return useMutation({
    mutationFn: async (dto: CreateProjectDto): Promise<{ id: string }> => {
      const res = await apiFetch(`/projects`, {
        method: "POST",
        body: JSON.stringify(dto),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to create project");
      return res.json();
    },
  });
}

export function useUpdateProject() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectDto }): Promise<{ id: string }> => {
      const res = await apiFetch(`/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to update project");
      return res.json();
    },
  });
}
