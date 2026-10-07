import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkInTicketService,
  getMyTicketsService,
  getTicketQrService,
  validateTicketService,
} from "../../Services/ticketServices";
import { toRejectValue } from "../../utils/apiError";
import { cancelBooking, createBooking } from "./bookingsSlice";

export const getMyTickets = createAsyncThunk(
  "tickets/mine",
  async (params, { rejectWithValue }) => {
    try {
      return await getMyTicketsService(params); // { data, meta }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load tickets."));
    }
  },
  {
    // layout (sidebar badge) and the tickets page both request on mount
    condition: (_, { getState }) => !getState().tickets.loading,
  },
);

export const getTicketQr = createAsyncThunk(
  "tickets/qr",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await getTicketQrService(ticketId); // { ticketId, qrDataUrl }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load QR code."));
    }
  },
  {
    // a ticket's QR code never changes, skip refetching cached ones
    condition: (ticketId, { getState }) =>
      !getState().tickets.qrCodes[ticketId],
  },
);

// Organizer gate: preview a scanned / typed QR token
export const validateTicket = createAsyncThunk(
  "tickets/validate",
  async (qrToken, { rejectWithValue }) => {
    try {
      return await validateTicketService(qrToken); // { ticket, valid, reason }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not validate ticket."));
    }
  },
);

export const checkInTicket = createAsyncThunk(
  "tickets/checkIn",
  async (ticketId, { rejectWithValue }) => {
    try {
      return await checkInTicketService(ticketId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Check-in failed."));
    }
  },
);

const initialState = {
  tickets: [],
  pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
  loading: false,
  error: null,
  // qr codes keyed by ticket id
  qrCodes: {},
  qrLoading: false,
  qrError: null,
  // organizer check-in
  validation: null, // { ticket, valid, reason }
  validationLoading: false,
  validationError: null, // { message, status }
  checkInLoading: false,
  checkInError: null, // { message, status }
  checkedInTicket: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    resetCheckIn: (state) => {
      state.validation = null;
      state.validationError = null;
      state.validationLoading = false;
      state.checkInError = null;
      state.checkInLoading = false;
      state.checkedInTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // my tickets
      .addCase(getMyTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(getMyTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error.message;
      })
      // qr
      .addCase(getTicketQr.pending, (state) => {
        state.qrLoading = true;
        state.qrError = null;
      })
      .addCase(getTicketQr.fulfilled, (state, action) => {
        state.qrLoading = false;
        state.qrCodes[action.payload.ticketId] = action.payload.qrDataUrl;
      })
      .addCase(getTicketQr.rejected, (state, action) => {
        state.qrLoading = false;
        state.qrError = action.payload?.message ?? action.error.message;
      })
      // new booking -> new tickets, keep the sidebar badge in sync
      .addCase(createBooking.fulfilled, (state, action) => {
        state.pagination.total += action.payload.tickets?.length ?? 0;
      })
      // cancelling a booking invalidates its tickets
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.tickets = state.tickets.map((ticket) =>
          ticket.bookingId === action.payload.id
            ? { ...ticket, status: "CANCELLED" }
            : ticket,
        );
      })
      // validate
      .addCase(validateTicket.pending, (state) => {
        state.validationLoading = true;
        state.validationError = null;
        state.validation = null;
        state.checkInError = null;
        state.checkedInTicket = null;
      })
      .addCase(validateTicket.fulfilled, (state, action) => {
        state.validationLoading = false;
        state.validation = action.payload;
      })
      .addCase(validateTicket.rejected, (state, action) => {
        state.validationLoading = false;
        state.validationError = action.payload ?? {
          message: action.error.message,
          status: null,
        };
      })
      // check in
      .addCase(checkInTicket.pending, (state) => {
        state.checkInLoading = true;
        state.checkInError = null;
      })
      .addCase(checkInTicket.fulfilled, (state, action) => {
        state.checkInLoading = false;
        state.checkedInTicket = action.payload;
        if (state.validation) {
          state.validation = {
            ...state.validation,
            valid: false,
            ticket: { ...state.validation.ticket, ...action.payload },
          };
        }
      })
      .addCase(checkInTicket.rejected, (state, action) => {
        state.checkInLoading = false;
        state.checkInError = action.payload ?? {
          message: action.error.message,
          status: null,
        };
      });
  },
});

export const { resetCheckIn } = ticketsSlice.actions;
export default ticketsSlice.reducer;
