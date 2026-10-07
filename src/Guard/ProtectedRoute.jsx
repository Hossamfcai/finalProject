import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorageItem } from "../utils/localStorage";

export default function ProtectedRoute({ allowedRoles }) {
  const token = getLocalStorageItem("token");
  const role = getLocalStorageItem("role")?.toLowerCase();

  if (!token || !role) {
    return <Navigate to="/Authentication" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // admin shares the organizer area (avoids a redirect loop for that role)
    return role === "organizer" || role === "admin" ? (
      <Navigate to="/OrganizerDashboard" replace />
    ) : (
      <Navigate to="/AttendeeDashboard" replace />
    );
  }

  return <Outlet />;
}
