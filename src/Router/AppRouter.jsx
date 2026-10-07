import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedAuth from "../Guard/ProtectedAuth";
import LandingPage from "../Features/Public/page/LandingPage";
import AuthenticationLayout from "../Components/Layout/AuthenticationLayout";
import OrganizerDashboardLayout from "../Components/Layout/OrganizerDashboardLayout";
import AttendeeDashboardLayout from "../Components/Layout/AttendeeDashboardLayout";
import Login from "../Features/Authentication/pages/Login";
import SignUp from "../Features/Authentication/pages/SignUp";
import ProtectedRoute from "../Guard/ProtectedRoute";
import OverView from "../Features/Organizer/OverView";
import Events from "../Features/Organizer/Events";
import AddEvent from "../Features/Organizer/AddEvent";
import EditEvent from "../Features/Organizer/EditEvent";
import EventBookings from "../Features/Organizer/EventBookings";
import EventAnalytics from "../Features/Organizer/EventAnalytics";
import CheckIn from "../Features/Organizer/CheckIn";
import DiscoverEvents from "../Features/Attendees/pages/DiscoverEvents";
import FavouritesEvents from "../Features/Attendees/pages/FavouritesEvents";
import Tickets from "../Features/Attendees/pages/Tickets";
import BookingHistory from "../Features/Attendees/pages/BookingHistory";
import AttendeeProfile from "../Features/Attendees/pages/AttendeeProfile";
import NotFoundPage from "../Guard/NotFoundPage";
import EventDetails from "../Features/Public/page/EventDetails";

// import ProtectedAuth from "./ProtectedAuth";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/Eventdetails/:id" element={<EventDetails />} />
      {/*if there are authenticated user or organizer can not return to landing page without logout first so empty */}
      <Route element={<ProtectedAuth />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landingPage" element={<LandingPage />} />
      </Route>
      {/*if there are authenticated user or organizer can not return to Authentication pages without logout first so empty */}
      <Route element={<ProtectedAuth />}>
        <Route path="/Authentication" element={<AuthenticationLayout />}>
          <Route index element={<Navigate to="Login" replace />} />
          <Route path="Login" element={<Login />} />
          <Route path="Resgistration" element={<SignUp />} />
        </Route>
      </Route>
      {/*only organizer has access to this route */}
      <Route element={<ProtectedRoute allowedRoles={["organizer", "admin"]} />}>
        <Route
          path="/OrganizerDashboard"
          element={<OrganizerDashboardLayout />}
        >
          <Route index element={<Navigate to="OverView" replace />} />
          <Route path="OverView" element={<OverView />} />
          <Route path="Events" element={<Events />} />
          <Route path="AddEvent" element={<AddEvent />} />
          <Route path="Events/:id/Edit" element={<EditEvent />} />
          <Route path="Events/:id/Bookings" element={<EventBookings />} />
          <Route path="Events/:id/Analytics" element={<EventAnalytics />} />
          <Route path="CheckIn" element={<CheckIn />} />
        </Route>
      </Route>
      {/* admin and user have access to this route */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/AttendeeDashboard" element={<AttendeeDashboardLayout />}>
          <Route index element={<Navigate to="DiscoverEvents" replace />} />
          <Route path="DiscoverEvents" element={<DiscoverEvents />} />
          <Route path="Tickets" element={<Tickets />} />
          <Route path="FavouritesEvents" element={<FavouritesEvents />} />
          <Route path="BookingHistory" element={<BookingHistory />} />
          <Route path="AttendeeProfile" element={<AttendeeProfile />} />
        </Route>
      </Route>
      {/* Unkown Path */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
