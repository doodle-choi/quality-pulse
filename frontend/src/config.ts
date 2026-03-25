export const API_BASE_URL = typeof window !== "undefined" ? "/api/v1" : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");

// Server-side internal API URL (for Docker network)
export const INTERNAL_API_BASE_URL = process.env.INTERNAL_API_URL || "http://backend:8000/api/v1";
