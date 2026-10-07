import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addToFavouriteService,
  getEventsService,
  getFavouritesServices,
  getSingleEventService,
  removeFromFavouriteService,
  searchEventsService,
} from "../../Services/eventsServices";
import { getCategoriesService } from "../../Services/categoryService";

export const getEvents = createAsyncThunk("events/data", async () => {
  const response = await getEventsService();
  return response.data; // { data, meta, success }
});
export const searchOnEvents = createAsyncThunk(
  "events/search",
  async (filters) => {
    const response = await searchEventsService(filters);

    return response.data; // { data, meta, success }
  },
);
export const getSingleEvent = createAsyncThunk(
  "events/getSingleEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await getSingleEventService(eventId);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status ?? null,
        message: error.message,
      });
    }
  },
);
export const getCategories = createAsyncThunk("events/categories", async () => {
  const response = await getCategoriesService();

  return response;
});
export const addFavoutite = createAsyncThunk(
  "events/addFavoutite",
  async (eventId) => {
    const response = await addToFavouriteService(eventId);

    return response.data; // favourite record { id, userId, eventId, createdAt }
  },
);
export const removeFavourite = createAsyncThunk(
  "events/removeFavourite",
  async (eventId) => {
    await removeFromFavouriteService(eventId);

    return eventId;
  },
);
export const getFavourites = createAsyncThunk("events/favourites", async () => {
  const response = await getFavouritesServices();

  return response; // [{ id, eventId, event }]
});

const initialState = {
  events: [],
  searchEvents: [],
  favouriteEvents: [],
  categories: [],
  pagination: { page: 1, limit: 12, total: 0, totalPages: 1 },
  filters: { search: "", category: "", date: "" },
  specificEvent: {},
  loading: false,
  error: null,
  // event details
  notFound: false,
  // favourites
  favouritesLoading: false,
  favouritesError: null,
  pendingFavouriteIds: [],
};

const networkMessage = (action) =>
  action.error.message.includes("Network Error")
    ? "Unreachable to the server."
    : "Can not reach to the data";

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get events//
      .addCase(getEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = [...action.payload.data];
        state.searchEvents = [...action.payload.data];
        state.pagination = action.payload.meta;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = networkMessage(action);
      })
      //get single event//
      .addCase(getSingleEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notFound = false;
        if (Object.keys(state.specificEvent).length) {
          state.specificEvent = {};
        }
      })
      .addCase(getSingleEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.specificEvent = action.payload;
      })
      .addCase(getSingleEvent.rejected, (state, action) => {
        state.loading = false;
        const status = action.payload?.status;
        // invalid ObjectId -> 500 from prisma, missing -> 404
        state.notFound = status === 404 || status === 400 || status === 500;
        state.error = action.payload?.message?.includes("Network Error")
          ? "Unreachable to the server."
          : "Can not reach to the data";
      })
      //get categories// (does not toggle the shared events loader)
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = [...action.payload];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.error = networkMessage(action);
      })
      //search events
      .addCase(searchOnEvents.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        // remember what was actually applied, so page changes reuse it
        const { search = "", category = "", date = "" } = action.meta.arg ?? {};
        state.filters = { search, category, date };
      })
      .addCase(searchOnEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.searchEvents = [...action.payload.data];
        state.pagination = action.payload.meta;
      })
      .addCase(searchOnEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = networkMessage(action);
      })
      //add favourite
      .addCase(addFavoutite.pending, (state, action) => {
        state.favouritesError = null;
        state.pendingFavouriteIds.push(action.meta.arg);
      })
      .addCase(addFavoutite.fulfilled, (state, action) => {
        const eventId = action.meta.arg;
        state.pendingFavouriteIds = state.pendingFavouriteIds.filter(
          (id) => id !== eventId,
        );
        const event =
          state.searchEvents.find((item) => item.id === eventId) ||
          state.events.find((item) => item.id === eventId) ||
          (state.specificEvent?.id === eventId ? state.specificEvent : null);
        if (!state.favouriteEvents.some((fav) => fav.eventId === eventId)) {
          state.favouriteEvents.unshift({ ...action.payload, eventId, event });
        }
      })
      .addCase(addFavoutite.rejected, (state, action) => {
        state.pendingFavouriteIds = state.pendingFavouriteIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.favouritesError = networkMessage(action);
      })
      //remove favourite
      .addCase(removeFavourite.pending, (state, action) => {
        state.favouritesError = null;
        state.pendingFavouriteIds.push(action.meta.arg);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.pendingFavouriteIds = state.pendingFavouriteIds.filter(
          (id) => id !== action.payload,
        );
        state.favouriteEvents = state.favouriteEvents.filter(
          (fav) => fav.eventId !== action.payload,
        );
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.pendingFavouriteIds = state.pendingFavouriteIds.filter(
          (id) => id !== action.meta.arg,
        );
        state.favouritesError = networkMessage(action);
      })
      //favourite events
      .addCase(getFavourites.pending, (state) => {
        state.favouritesLoading = true;
        state.favouritesError = null;
      })
      .addCase(getFavourites.fulfilled, (state, action) => {
        state.favouritesLoading = false;
        state.favouriteEvents = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getFavourites.rejected, (state, action) => {
        state.favouritesLoading = false;
        state.favouritesError = networkMessage(action);
      });
  },
});

// export const {} = eventsSlice.actions;
export default eventsSlice.reducer;
