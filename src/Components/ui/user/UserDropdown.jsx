import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../Features/Authentication/Slices/authSlice";

export default function UserDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, loading } = useSelector((state) => state.auth);
  const isOrganizer = ["organizer", "admin"].includes(
    user?.role?.toLowerCase(),
  );

  const avatarName = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  async function onLogout() {
    // clears the token and resets every slice so no data leaks to the next user
    await dispatch(logoutUser());
    navigate("/landingPage", { replace: true });
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2.5 p-1.5 animate-pulse">
        {/* Skeleton Avatar Circle */}
        <div className="w-9 h-9 rounded-full bg-surface-container-high shrink-0" />

        {/* Skeleton User Name (Hidden on smaller screens matching trigger) */}
        <div className="hidden sm:block h-4 w-28 bg-surface-container-high rounded" />

        {/* Skeleton Chevron Icon */}
        <div className="w-4 h-4 rounded bg-surface-container-high shrink-0" />
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Header Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-lg transition-colors hover:bg-surface-container active:bg-surface-container-high focus:outline-none"
        aria-expanded={isOpen}
      >
        {/* Two-Char Avatar Circle */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-on-primary font-bold text-xs font-label-caps shrink-0">
          {avatarName}
        </div>

        {/* User Name */}
        <span className="hidden sm:inline-block font-semibold text-sm text-on-surface whitespace-nowrap">
          {user.name}
        </span>

        <ChevronDown
          className={`w-4 h-4 text-secondary transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-surface-container shadow-lg ring-1 ring-black/5 divide-y divide-outline/10 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="px-4 py-3">
            <p className="text-xs text-secondary font-medium">Signed in as</p>
            <p className="text-sm font-semibold text-on-surface truncate">
              {user.name}
            </p>
          </div>
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                navigate(
                  isOrganizer
                    ? "/OrganizerDashboard/OverView"
                    : "/AttendeeDashboard/AttendeeProfile",
                );
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-surface-lowest hover:bg-surface-container-high transition-colors font-semibold"
            >
              <User className="w-4 h-4 shrink-0" />
              <span>{isOrganizer ? "Dashboard" : "Profile"}</span>
            </button>
          </div>
          {/* Logout Action */}
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-error-container/20 transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4 text-error shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
