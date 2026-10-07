import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../Features/Attendees/Components/Navbar";
import Sidebar from "../../Features/Attendees/Components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { getuserData } from "../../Features/Authentication/Slices/authSlice";
import {
  getCategories,
  getEvents,
  getFavourites,
} from "../../Store/Slices/eventsSlice";
import { getMyTickets } from "../../Store/Slices/ticketsSlice";

const DESKTOP_BREAKPOINT = 1024;

export default function AttendeeDashboardLayout() {
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

    // Sync initial state
    setIsSidebarOpen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  useEffect(() => {
    dispatch(getuserData());
    dispatch(getEvents());
    dispatch(getCategories());
    dispatch(getFavourites());
    dispatch(getMyTickets({ page: 1, limit: 100 }));
  }, [dispatch]);

  // expired / revoked token -> back to sign in
  useEffect(() => {
    if (sessionExpired) {
      navigate("/Authentication/Login", { replace: true });
    }
  }, [sessionExpired, navigate]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={handleOpenSidebar} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
