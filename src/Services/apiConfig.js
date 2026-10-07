import { getLocalStorageItem } from "../utils/localStorage";

export const API_BASE_URL = "http://localhost:5000/api/v1";

// Builds the axios config carrying the bearer token for protected endpoints.
export function authConfig(extra = {}) {
  const token = getLocalStorageItem("token");
  return {
    ...extra,
    headers: { ...(extra.headers || {}), Authorization: `Bearer ${token}` },
  };
}
