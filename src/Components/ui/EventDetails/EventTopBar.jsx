import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import UserDropdown from "../user/UserDropdown";

// Header shown on public pages (event details) for signed-in users.
export default function EventTopBar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isOrganizer = ["organizer", "admin"].includes(user?.role?.toLowerCase());
  const dashboardPath = isOrganizer
    ? "/OrganizerDashboard/Events"
    : "/AttendeeDashboard/DiscoverEvents";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-20 max-w-[1360px] mx-auto px-gutter-mobile sm:px-gutter flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md min-w-0">
          <Logo />
          <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className="cursor-pointer hidden sm:inline-flex items-center gap-space-xs text-label-lg text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs rounded-xl hover:bg-surface-container transition-colors"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
            {isOrganizer ? "My Events" : "Back to Discover"}
          </button>
        </div>
        <UserDropdown />
      </div>
    </header>
  );
}
