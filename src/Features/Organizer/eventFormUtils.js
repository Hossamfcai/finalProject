import { toInputDate, toInputDateTime } from "../../utils/formatedDate";

export const emptyTicketType = {
  name: "",
  price: "",
  totalQuantity: "",
  salesStart: "",
  salesEnd: "",
};

export const createEventDefaults = {
  title: "",
  description: "",
  categoryId: "",
  imageUrl: "",
  date: "",
  startTime: "",
  endTime: "",
  venue: "",
  address: "",
  latitude: "",
  longitude: "",
  status: "UPCOMING",
  ticketTypes: [{ ...emptyTicketType }],
};

// API event -> form values
export function eventToFormValues(event) {
  return {
    title: event.title ?? "",
    description: event.description ?? "",
    categoryId: event.categoryId ?? "",
    imageUrl: event.imageUrl ?? "",
    date: toInputDate(event.date),
    startTime: event.startTime ?? "",
    endTime: event.endTime ?? "",
    venue: event.venue ?? "",
    address: event.address ?? "",
    latitude: event.latitude ?? "",
    longitude: event.longitude ?? "",
    // ARCHIVED is server-only; keep the form on a settable value
    status: ["UPCOMING", "PUBLISHED", "CANCELED"].includes(event.status)
      ? event.status
      : "PUBLISHED",
    ticketTypes: (event.ticketTypes ?? []).map((ticketType) => ({
      id: ticketType.id,
      sold: ticketType.totalQuantity - ticketType.availableQuantity,
      name: ticketType.name,
      price: ticketType.price,
      totalQuantity: ticketType.totalQuantity,
      salesStart: toInputDateTime(ticketType.salesStart),
      salesEnd: toInputDateTime(ticketType.salesEnd),
    })),
  };
}

// form values -> POST/PATCH /events body
export function toEventPayload(values) {
  const payload = {
    title: values.title.trim(),
    description: values.description.trim(),
    categoryId: values.categoryId,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    venue: values.venue.trim(),
    address: values.address.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
    status: values.status,
  };
  if (values.imageUrl?.trim()) payload.imageUrl = values.imageUrl.trim();
  return payload;
}

// form ticket type -> POST/PATCH ticket-types body (id kept for routing)
export function toTicketTypePayload(ticketType) {
  const payload = {
    name: ticketType.name.trim(),
    price: Number(ticketType.price),
    totalQuantity: Number(ticketType.totalQuantity),
  };
  if (ticketType.id) payload.id = ticketType.id;
  if (ticketType.salesStart) {
    payload.salesStart = new Date(ticketType.salesStart).toISOString();
  }
  if (ticketType.salesEnd) {
    payload.salesEnd = new Date(ticketType.salesEnd).toISOString();
  }
  return payload;
}

const ticketTypeChanged = (current, original) =>
  ["name", "price", "totalQuantity", "salesStart", "salesEnd"].some(
    (key) => String(current[key] ?? "") !== String(original[key] ?? ""),
  );

/**
 * Compares edited ticket types with the originals.
 * -> { ticketTypes: [...new, ...changed], removedTicketTypeIds }
 */
export function diffTicketTypes(currentTicketTypes, originalTicketTypes = []) {
  const originalsById = new Map(
    originalTicketTypes.map((ticketType) => [ticketType.id, ticketType]),
  );
  const keptIds = new Set(
    currentTicketTypes.filter((ticketType) => ticketType.id).map((t) => t.id),
  );
  const ticketTypes = currentTicketTypes
    .filter(
      (ticketType) =>
        !ticketType.id ||
        ticketTypeChanged(ticketType, originalsById.get(ticketType.id) ?? {}),
    )
    .map(toTicketTypePayload);
  const removedTicketTypeIds = originalTicketTypes
    .map((ticketType) => ticketType.id)
    .filter((id) => !keptIds.has(id));
  return { ticketTypes, removedTicketTypeIds };
}
