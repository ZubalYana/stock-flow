const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useAuthStore } from "../store/authStore";

function decodeJWTPayload(
  token: string
): { exp?: number; [key: string]: unknown } | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWTPayload(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  requreAuth: boolean = true
): Promise<Response> => {
  const token = useAuthStore.getState().token;
  const formData = options.body instanceof FormData;

  try {

    if(requreAuth){
    if (!token || isTokenExpired(token)) {
      useAuthStore.getState().logOut();
      throw new Error("Unauthorized");
    }
}
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: options.method,
      headers: {
        ...(!formData && { "Content-type": "application/json" }),
        ...(token && !isTokenExpired(token) && { Authorization: `Bearer ${token}`})
      },
      body: options.body,
    });

    if (!res.ok) {
      if (res.status === 401) {
        useAuthStore.getState().logOut();
        throw new Error("Unauthorized");
      }
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
