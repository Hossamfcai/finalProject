import axios from "axios";
import { API_BASE_URL, authConfig } from "./apiConfig";

// body: { eventId, ticketTypeId, quantity } -> { booking, tickets }
export async function createBookingService(body) {
  const response = await axios.post(
    `${API_BASE_URL}/bookings`,
    body,
    authConfig(),
  );
  return response.data.data;
}

// -> { data: Booking[], meta }
export async function getMyBookingsService({ page = 1, limit = 10 } = {}) {
  const response = await axios.get(
    `${API_BASE_URL}/bookings/me`,
    authConfig({ params: { page, limit } }),
  );
  return response.data;
}

export async function getBookingByIdService(bookingId) {
  const response = await axios.get(
    `${API_BASE_URL}/bookings/${bookingId}`,
    authConfig(),
  );
  return response.data.data;
}

export async function cancelBookingService(bookingId) {
  const response = await axios.post(
    `${API_BASE_URL}/bookings/${bookingId}/cancel`,
    null,
    authConfig(),
  );
  return response.data.data;
}
