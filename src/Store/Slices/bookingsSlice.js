import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelBookingService,
  createBookingService,
  getMyBookingsService,
} from "../../Services/bookingServices";
import { toRejectValue } from "../../utils/apiError";

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (body, { rejectWithValue }) => {
    try {
      return await createBookingService(body); // { booking, tickets }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Booking failed."));
    }
  },
);

export const getMyBookings = createAsyncThunk(
  "bookings/mine",
  async (params, { rejectWithValue }) => {
    try {
      return await getMyBookingsService(params); // { data, meta }
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not load bookings."));
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (bookingId, { rejectWithValue }) => {
    try {
      return await cancelBookingService(bookingId);
    } catch (error) {
      return rejectWithValue(toRejectValue(error, "Can not cancel booking."));
    }
  },
);

const initialState = {
  bookings: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  loading: false,
  error: null,
  // create booking
  createLoading: false,
  createError: null,
  lastBooking: null,
  // cancel booking
  cancelingId: null,
  cancelError: null,
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingState: (state) => {
      state.createError = null;
      state.lastBooking = null;
      state.cancelError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create booking
      .addCase(createBooking.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.lastBooking = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createLoading = false;
        state.lastBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload?.message ?? action.error.message;
      })
      // my bookings
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.error.message;
      })
      // cancel booking
      .addCase(cancelBooking.pending, (state, action) => {
        state.cancelingId = action.meta.arg;
        state.cancelError = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelingId = null;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = {
            ...state.bookings[index],
            status: action.payload.status,
            tickets: action.payload.tickets ?? state.bookings[index].tickets,
          };
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelingId = null;
        state.cancelError = action.payload?.message ?? action.error.message;
      });
  },
});

export const { clearBookingState } = bookingsSlice.actions;
export default bookingsSlice.reducer;
