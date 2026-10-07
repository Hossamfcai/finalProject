import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../Features/Attendees/Components/Navbar";
import Sidebar from "../../Features/Attendees/Components/Sidebar";
import { getuserData } from "../../Features/Authentication/Slices/authSlice";
import { getCategories } from "../../Store/Slices/eventsSlice";
import { getOrganizerEvents } from "../../Store/Slices/organizerSlice";
import { organizerNavigationItems } from "../../utils/constants";

const DESKTOP_BREAKPOINT = 1024;

export default function OrganizerDashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sessionExpired } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth >= DESKTOP_BREAKPOINT;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`,
    );

    const handleViewportChange = (event) => {
      setIsSidebarOpen(event.matches);
    };

    // initial value comes from the useState initializer
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    dispatch(getuserData());
    dispatch(getCategories());
    dispatch(getOrganizerEvents({ page: 1, limit: 10 }));
  }, [dispatch]);

  // expired / revoked token -> back to sign in
  useEffect(() => {
    if (sessionExpired) {
      navigate("/Authentication/Login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        items={organizerNavigationItems}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          items={organizerNavigationItems}
        />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
