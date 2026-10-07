import { NavLink } from "react-router-dom";
import { BarChart3, Pencil, Users } from "lucide-react";

// Quick switch between an event's management pages.
export default function EventTabs({ eventId }) {
  const tabs = [
    { to: `/OrganizerDashboard/Events/${eventId}/Bookings`, label: "Bookings", icon: Users },
    { to: `/OrganizerDashboard/Events/${eventId}/Analytics`, label: "Analytics", icon: BarChart3 },
    { to: `/OrganizerDashboard/Events/${eventId}/Edit`, label: "Edit", icon: Pencil },
  ];
  return (
    <nav className="inline-flex flex-wrap gap-space-xs p-space-xs rounded-full bg-surface-container-lowest border border-border-hairline">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full text-label-md transition-colors ${isActive ? "bg-primary-ink text-on-primary" : "text-secondary-fill hover:bg-surface-container-low"}`
          }
        >
          <Icon size={14} strokeWidth={1.5} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
