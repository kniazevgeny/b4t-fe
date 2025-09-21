export const API_BASE = "https://f2680e3a5b24.ngrok-free.app/api/v1";
export const token = () => localStorage.getItem("accessToken");
export const setToken = (value: string) => localStorage.setItem("accessToken", value);

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("ngrok-skip-browser-warning", "69420");
  const t = token();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_BASE}${input.startsWith("/") ? "" : "/"}${input}`, {
    ...init,
    headers,
  });
  return res;
}

export * from "./auth.ts";
export * from "./profile.ts";
export * from "./tasks.ts";
