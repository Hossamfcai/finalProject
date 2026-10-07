import { formatedDateTime, hasEventEnded } from "./formatedDate";

// backend createBookingSchema: quantity 1..20
export const MAX_TICKETS_PER_BOOKING = 20;

// Why a ticket type can not be booked right now (null when it can).
export function getTicketUnavailableReason(ticket) {
  const now = new Date();
  if (!ticket?.availableQuantity) return "Sold out";
  if (ticket.salesStart && now < new Date(ticket.salesStart)) {
    return `Sales open ${formatedDateTime(ticket.salesStart)}`;
  }
  if (ticket.salesEnd && now > new Date(ticket.salesEnd)) {
    return "Sales ended";
  }
  return null;
}

// Why the whole event can not take bookings (null when it can).
// Mirrors bookingService.createBooking: only PUBLISHED events are bookable.
export function getEventBookingBlock(event) {
  if (!event?.id) return null;
  const status = event.status?.toUpperCase();
  if (status === "CANCELED") {
    return {
      title: "Event cancelled",
      message: "This event has been cancelled by the organizer.",
    };
  }
  if (status === "ARCHIVED" || hasEventEnded(event)) {
    return {
      title: "Event ended",
      message: "This event has already taken place.",
    };
  }
  if (status !== "PUBLISHED") {
    return {
      title: "Booking unavailable",
      message: "Ticket sales have not opened yet. Check back soon.",
    };
  }
  if (!event.ticketTypes?.length) {
    return {
      title: "Booking unavailable",
      message: "The organizer has not released tickets yet.",
    };
  }
  if (event.ticketTypes.every((ticket) => !ticket.availableQuantity)) {
    return {
      title: "Sold out",
      message: "Every ticket for this event has been booked.",
    };
  }
  return null;
}
