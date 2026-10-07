import axios from "axios";
import { API_BASE_URL, authConfig } from "./apiConfig";

// -> { data: Ticket[], meta }
export async function getMyTicketsService({ page = 1, limit = 100 } = {}) {
  const response = await axios.get(
    `${API_BASE_URL}/tickets/me`,
    authConfig({ params: { page, limit } }),
  );
  return response.data;
}

export async function getTicketByIdService(ticketId) {
  const response = await axios.get(
    `${API_BASE_URL}/tickets/${ticketId}`,
    authConfig(),
  );
  return response.data.data;
}

// -> { ticketId, qrDataUrl }
export async function getTicketQrService(ticketId) {
  const response = await axios.get(
    `${API_BASE_URL}/tickets/${ticketId}/qr`,
    authConfig(),
  );
  return response.data.data;
}

// Organizer gate preview -> { ticket, valid, reason }
export async function validateTicketService(qrToken) {
  const response = await axios.post(
    `${API_BASE_URL}/tickets/validate`,
    { qrToken },
    authConfig(),
  );
  return response.data.data;
}

export async function checkInTicketService(ticketId) {
  const response = await axios.post(
    `${API_BASE_URL}/tickets/${ticketId}/check-in`,
    null,
    authConfig(),
  );
  return response.data.data;
}
