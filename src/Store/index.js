import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer, {
  logoutUser,
} from "../Features/Authentication/Slices/authSlice";
import eventsReducer from "../Store/Slices/eventsSlice";
import bookingsReducer from "../Store/Slices/bookingsSlice";
import ticketsReducer from "../Store/Slices/ticketsSlice";
import reviewsReducer from "../Store/Slices/reviewsSlice";
import organizerReducer from "../Store/Slices/organizerSlice";

const appReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  bookings: bookingsReducer,
  tickets: ticketsReducer,
  reviews: reviewsReducer,
  organizer: organizerReducer,
});

// logging out wipes every user-scoped slice
const rootReducer = (state, action) =>
  appReducer(logoutUser.fulfilled.match(action) ? undefined : state, action);

export const store = configureStore({
  reducer: rootReducer,
});
