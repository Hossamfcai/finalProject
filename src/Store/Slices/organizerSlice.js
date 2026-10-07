import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createEventService,
  createTicketTypeService,
  deleteEventService,
  deleteTicketTypeService,
  getEventAnalyticsService,
  getEventBookingsService,
  getOrganizerAnalyticsService,
  getOrganizerEventService,
  getOrganizerEventsService,
  updateEventService,
  updateTicketTypeService,
} from "../../Services/organizerServices";
import { getErrorMessage, toRejectValue } from "../../utils/apiError";

export const getOrganizerEvents = createAsyncThunk(
  "organizer/events",
  async (params, { rejectWithValue }) => {
    try {
      return await getOrganizerEventsService(params); // { data, meta }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load your events."));
    }
  },
  {
    // layout (sidebar badge) and the events page both request on mount
    condition: (_, { getState }) => !getState().organizer.eventsLoading,
  },
);

export const getOrganizerEvent = createAsyncThunk(
  "organizer/event",
  async (eventId, { rejectWithValue }) => {
    try {
      return await getOrganizerEventService(eventId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load this event."));
    }
  },
);

/**
 * Creates or updates an event, then syncs its ticket types:
 *  - ticket types without an id are created
 *  - ticket types with an id are patched
 *  - ids listed in removedTicketTypeIds are deleted
 */
export const saveEvent = createAsyncThunk(
  "organizer/saveEvent",
  async (
    { eventId, eventData, ticketTypes = [], removedTicketTypeIds = [] },
    { rejectWithValue },
  ) => {
    let savedEvent;
    try {
      savedEvent = eventId
        ? await updateEventService(eventId, eventData)
        : await createEventService(eventData);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not save the event."));
    }

    const failures = [];
    for (const ticketTypeId of removedTicketTypeIds) {
      try {
        await deleteTicketTypeService(ticketTypeId);
      } catch (error) {
        const message = getErrorMessage(error);
        failures.push(
          /relation/i.test(message)
            ? "a ticket type with bookings can not be removed"
            : message,
        );
      }
    }
    for (const { id, ...ticketType } of ticketTypes) {
      try {
        if (id) {
          await updateTicketTypeService(id, ticketType);
        } else {
          await createTicketTypeService(savedEvent.id, ticketType);
        }
      } catch (error) {
        failures.push(`${ticketType.name}: ${getErrorMessage(error)}`);
      }
    }

    if (failures.length) {
      return rejectWithValue({
        message: `Event saved, but some ticket types failed (${failures.join(" | ")})`,
        eventId: savedEvent.id,
      });
    }
    return savedEvent;
  },
);

const RELATION_ERROR_MESSAGE =
  "This event has booking records and can not be deleted. Cancel it instead.";

/**
 * The backend refuses to delete an event that still owns ticket types
 * (required Prisma relation), so they are removed first.
 * Ticket types that have bookings can not be removed -> the UI offers "Cancel".
 */
export const deleteEvent = createAsyncThunk(
  "organizer/deleteEvent",
  async ({ eventId, ticketTypeIds = [] }, { rejectWithValue }) => {
    try {
      for (const ticketTypeId of ticketTypeIds) {
        await deleteTicketTypeService(ticketTypeId);
      }
      await deleteEventService(eventId);
      return eventId;
    } catch (error) {
      const value = toRejectValue(error, "Can not delete this event.");
      if (/relation/i.test(value.message)) value.message = RELATION_ERROR_MESSAGE;
      return rejectWithValue(value);
    }
  },
);

// quick status change from the events list (publish / cancel)
export const updateEventStatus = createAsyncThunk(
  "organizer/updateEventStatus",
  async ({ eventId, status }, { rejectWithValue }) => {
    try {
      return await updateEventService(eventId, { status });
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not update status."));
    }
  },
);

export const getEventBookings = createAsyncThunk(
  "organizer/eventBookings",
  async (eventId, { rejectWithValue }) => {
    try {
      return await getEventBookingsService(eventId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load bookings."));
    }
  },
);

export const getEventAnalytics = createAsyncThunk(
  "organizer/eventAnalytics",
  async (eventId, { rejectWithValue }) => {
    try {
      return await getEventAnalyticsService(eventId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load analytics."));
    }
  },
);

export const getOrganizerAnalytics = createAsyncThunk(
  "organizer/analytics",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrganizerAnalyticsService();
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load analytics."));
    }
  },
);

const initialState = {
  // events list
  events: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  eventsLoading: false,
  eventsError: null,
  // single event (edit / bookings / analytics headers)
  currentEvent: null,
  currentEventLoading: false,
  currentEventError: null,
  // create / edit
  saveLoading: false,
  saveError: null,
  // delete / status
  deletingId: null,
  updatingStatusId: null,
  actionError: null,
  // event bookings
  eventBookings: [],
  eventBookingsLoading: false,
  eventBookingsError: null,
  // per event analytics
  eventAnalytics: null,
  eventAnalyticsLoading: false,
  eventAnalyticsError: null,
  // overall analytics
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
};

const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    clearSaveError: (state) => {
      state.saveError = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.currentEventError = null;
      state.eventBookings = [];
      state.eventAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // events list
      .addCase(getOrganizerEvents.pending, (state) => {
        state.eventsLoading = true;
        state.eventsError = null;
      })
      .addCase(getOrganizerEvents.fulfilled, (state, action) => {
        state.eventsLoading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(getOrganizerEvents.rejected, (state, action) => {
        state.eventsLoading = false;
        state.eventsError = action.payload?.message ?? action.error.message;
      })
      // single event
      .addCase(getOrganizerEvent.pending, (state, action) => {
        state.currentEventLoading = true;
        state.currentEventError = null;
        if (state.currentEvent?.id !== action.meta.arg) {
          state.currentEvent = null;
        }
      })
      .addCase(getOrganizerEvent.fulfilled, (state, action) => {
        state.currentEventLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(getOrganizerEvent.rejected, (state, action) => {
        state.currentEventLoading = false;
        state.currentEventError = action.payload ?? {
          message: action.error.message,
          status: null,
        };
      })
      // save
      .addCase(saveEvent.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(saveEvent.fulfilled, (state) => {
        state.saveLoading = false;
      })
      .addCase(saveEvent.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.payload?.message ?? action.error.message;
      })
      // delete
      .addCase(deleteEvent.pending, (state, action) => {
        state.deletingId = action.meta.arg.eventId;
        state.actionError = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deletingId = null;
        state.events = state.events.filter(
          (event) => event.id !== action.payload,
        );
        state.pagination.total = Math.max(state.pagination.total - 1, 0);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deletingId = null;
        state.actionError = action.payload?.message ?? action.error.message;
      })
      // status
      .addCase(updateEventStatus.pending, (state, action) => {
        state.updatingStatusId = action.meta.arg.eventId;
        state.actionError = null;
      })
      .addCase(updateEventStatus.fulfilled, (state, action) => {
        state.updatingStatusId = null;
        state.events = state.events.map((event) =>
          event.id === action.payload.id
            ? { ...event, status: action.payload.status }
            : event,
        );
        if (state.currentEvent?.id === action.payload.id) {
          state.currentEvent.status = action.payload.status;
        }
      })
      .addCase(updateEventStatus.rejected, (state, action) => {
        state.updatingStatusId = null;
        state.actionError = action.payload?.message ?? action.error.message;
      })
      // event bookings
      .addCase(getEventBookings.pending, (state) => {
        state.eventBookingsLoading = true;
        state.eventBookingsError = null;
      })
      .addCase(getEventBookings.fulfilled, (state, action) => {
        state.eventBookingsLoading = false;
        state.eventBookings = action.payload;
      })
      .addCase(getEventBookings.rejected, (state, action) => {
        state.eventBookingsLoading = false;
        state.eventBookingsError =
          action.payload?.message ?? action.error.message;
      })
      // event analytics
      .addCase(getEventAnalytics.pending, (state) => {
        state.eventAnalyticsLoading = true;
        state.eventAnalyticsError = null;
      })
      .addCase(getEventAnalytics.fulfilled, (state, action) => {
        state.eventAnalyticsLoading = false;
        state.eventAnalytics = action.payload;
      })
      .addCase(getEventAnalytics.rejected, (state, action) => {
        state.eventAnalyticsLoading = false;
        state.eventAnalyticsError =
          action.payload?.message ?? action.error.message;
      })
      // overall analytics
      .addCase(getOrganizerAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.analyticsError = null;
      })
      .addCase(getOrganizerAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = action.payload;
      })
      .addCase(getOrganizerAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.analyticsError = action.payload?.message ?? action.error.message;
      });
  },
});

export const { clearSaveError, clearCurrentEvent } = organizerSlice.actions;
export default organizerSlice.reducer;
