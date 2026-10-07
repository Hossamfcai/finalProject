import axios from "axios";
import { getLocalStorageItem } from "../utils/localStorage";

export async function getEventsService() {
  try {
    const responese = await axios.get("http://localhost:5000/api/v1/events");
    return responese;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
export async function searchEventsService({
  search = "",
  category = "",
  date = "",
  page = 1,
  limit = 12,
} = {}) {
  try {
    const response = await axios.get("http://localhost:5000/api/v1/events", {
      params: { search, category, date, page, limit },
    });

    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}
export async function getSingleEventService(eventId) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/events/${eventId}`,
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching single event:", error);
    throw error;
  }
}

export async function addToFavouriteService(eventId) {
  const token = getLocalStorageItem("token");

  if (!token) {
    return {};
  }
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/favorites/${eventId}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching single event:", error);
    throw error;
  }
}
export async function getFavouritesServices() {
  const token = getLocalStorageItem("token");

  if (!token) {
    return [];
  }
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/favorites`,

      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching single event:", error);
    throw error;
  }
}
export async function removeFromFavouriteService(eventId) {
  const token = getLocalStorageItem("token");

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/favorites/${eventId}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  } catch (error) {
    console.error("Error removing favourite event:", error);
    throw error;
  }
}
