import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorageItem } from "../utils/localStorage";

export default function ProtectedAuth() {
  const token = getLocalStorageItem("token");
  const role = getLocalStorageItem("role");

  if (token && role) {
    if (["organizer", "admin"].includes(role.toLowerCase())) {
      return <Navigate to="/OrganizerDashboard" replace />;
    }
    return <Navigate to="/AttendeeDashboard" replace />;
  }
  return <Outlet />;
}
