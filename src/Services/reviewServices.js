import axios from "axios";
import { API_BASE_URL, authConfig } from "./apiConfig";

// -> { reviews, averageRating, reviewCount }
export async function getEventReviewsService(eventId) {
  const response = await axios.get(`${API_BASE_URL}/events/${eventId}/reviews`);
  return response.data.data;
}

// body: { rating, comment? }
export async function createReviewService(eventId, body) {
  const response = await axios.post(
    `${API_BASE_URL}/events/${eventId}/reviews`,
    body,
    authConfig(),
  );
  return response.data.data;
}

export async function deleteReviewService(reviewId) {
  const response = await axios.delete(
    `${API_BASE_URL}/reviews/${reviewId}`,
    authConfig(),
  );
  return response.data.data;
}
