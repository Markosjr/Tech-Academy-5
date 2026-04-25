import { getToken } from "./authStorage";

const RAW_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const BASE_URL = RAW_URL.endsWith("/") ? RAW_URL.slice(0, -1) : RAW_URL;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const response = await fetch(`${BASE_URL}${cleanEndpoint}`, {
        ...options,
        cache: "no-store",
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erro na requisição");
    }

    return data as T;
}

export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
    post: <T, U>(endpoint: string, body: U) => request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: <T, U>(endpoint: string, body: U) => request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
