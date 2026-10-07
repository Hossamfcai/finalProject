import axios from "axios";
import { setLocalStorageItem } from "../../../utils/localStorage";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "../../../utils/localStorage";

export async function loginService(body) {
  const response = await axios.post(
    `http://localhost:5000/api/v1/auth/login`,
    body,
  );
  if (response.status == 200) {
    setLocalStorageItem("token", response.data.data.token);
    setLocalStorageItem("role", response.data.data.user.role.toLowerCase());
  }
  return response.data.data.user;
}

export async function registerService(body) {
  const response = await axios.post(
    `http://localhost:5000/api/v1/auth/register`,
    body,
  );
  return response.data.data.user;
}

// Stateless JWT: the server call is best-effort, the token is always discarded.
export async function logoutService() {
  const token = getLocalStorageItem("token");
  try {
    if (token) {
      await axios.post(`http://localhost:5000/api/v1/auth/logout`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    removeLocalStorageItem("token");
    removeLocalStorageItem("role");
  }
}

export async function getUserDataService() {
  const token = getLocalStorageItem("token");
  if (!token) {
    return {};
  }
  const response = await axios.get(`http://localhost:5000/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
}
