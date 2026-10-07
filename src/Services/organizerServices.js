import axios from "axios";
import { API_BASE_URL, authConfig } from "./apiConfig";

// ---------- organizer scoped reads ----------
export async function getOrganizerEventsService({ page = 1, limit = 10 } = {}) {
  const response = await axios.get(
    `${API_BASE_URL}/organizer/events`,
    authConfig({ params: { page, limit } }),
  );
  return response.data; // { data, meta }
}

export async function getOrganizerEventService(eventId) {
  const response = await axios.get(
    `${API_BASE_URL}/organizer/events/${eventId}`,
    authConfig(),
  );
  return response.data.data;
}

export async function getEventBookingsService(eventId) {
  const response = await axios.get(
    `${API_BASE_URL}/organizer/events/${eventId}/bookings`,
    authConfig(),
  );
  return response.data.data;
}

export async function getEventAnalyticsService(eventId) {
  const response = await axios.get(
    `${API_BASE_URL}/organizer/events/${eventId}/analytics`,
    authConfig(),
  );
  return response.data.data;
}

export async function getOrganizerAnalyticsService() {
  const response = await axios.get(
    `${API_BASE_URL}/organizer/analytics`,
    authConfig(),
  );
  return response.data.data;
}

// ---------- event CRUD ----------
export async function createEventService(body) {
  const response = await axios.post(
    `${API_BASE_URL}/events`,
    body,
    authConfig(),
  );
  return response.data.data;
}

export async function updateEventService(eventId, body) {
  const response = await axios.patch(
    `${API_BASE_URL}/events/${eventId}`,
    body,
    authConfig(),
  );
  return response.data.data;
}

export async function deleteEventService(eventId) {
  const response = await axios.delete(
    `${API_BASE_URL}/events/${eventId}`,
    authConfig(),
  );
  return response.data.data;
}

// ---------- ticket types ----------
export async function createTicketTypeService(eventId, body) {
  const response = await axios.post(
    `${API_BASE_URL}/events/${eventId}/ticket-types`,
    body,
    authConfig(),
  );
  return response.data.data;
}

export async function updateTicketTypeService(ticketTypeId, body) {
  const response = await axios.patch(
    `${API_BASE_URL}/ticket-types/${ticketTypeId}`,
    body,
    authConfig(),
  );
  return response.data.data;
}

export async function deleteTicketTypeService(ticketTypeId) {
  const response = await axios.delete(
    `${API_BASE_URL}/ticket-types/${ticketTypeId}`,
    authConfig(),
  );
  return response.data.data;
}
