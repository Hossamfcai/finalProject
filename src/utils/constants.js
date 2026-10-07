import {
  Badge,
  Bookmark,
  CalendarDays,
  Compass,
  History,
  LayoutDashboard,
  PlusCircle,
  ScanLine,
  Ticket,
} from "lucide-react";
// badgeKey -> live count resolved by the Sidebar from the redux store
export const navigationItems = [
  {
    label: "Discover Events",
    path: "/AttendeeDashboard/DiscoverEvents",
    icon: Compass,
  },
  {
    label: "My Tickets",
    path: "/AttendeeDashboard/Tickets",
    icon: Ticket,
    badgeKey: "tickets",
  },
  {
    label: "Booking History",
    path: "/AttendeeDashboard/BookingHistory",
    icon: History,
  },
  {
    label: "Saved & Favorites",
    path: "/AttendeeDashboard/FavouritesEvents",
    icon: Bookmark,
    badgeKey: "favourites",
  },
  {
    label: "Patron Profile",
    path: "/AttendeeDashboard/AttendeeProfile",
    icon: Badge,
  },
];

export const organizerNavigationItems = [
  {
    label: "Overview",
    path: "/OrganizerDashboard/OverView",
    icon: LayoutDashboard,
  },
  {
    label: "My Events",
    path: "/OrganizerDashboard/Events",
    icon: CalendarDays,
    badgeKey: "organizerEvents",
  },
  {
    label: "Create Event",
    path: "/OrganizerDashboard/AddEvent",
    icon: PlusCircle,
  },
  {
    label: "Check-in",
    path: "/OrganizerDashboard/CheckIn",
    icon: ScanLine,
  },
];

export const EVENT_STATUS_OPTIONS = [
  {
    value: "UPCOMING",
    label: "Upcoming",
    description: "Announce the event. Visible to attendees, bookings closed.",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Live and open for ticket bookings.",
  },
  {
    value: "CANCELED",
    label: "Cancelled",
    description: "Event called off. Bookings are closed.",
  },
];

export const eventFilterOptions = {
  categories: [
    {
      id: "music-concerts",
      label: "Music & Concerts",
      count: 54,
      checked: true,
    },
    {
      id: "technology-design",
      label: "Technology & Design",
      count: 32,
      checked: false,
    },
    {
      id: "food-wine",
      label: "Food & Wine",
      count: 21,
      checked: false,
    },
    {
      id: "arts-culture",
      label: "Arts & Culture",
      count: 18,
      checked: false,
    },
    {
      id: "wellness-retreat",
      label: "Wellness & Retreat",
      count: 11,
      checked: false,
    },
    {
      id: "business-networking",
      label: "Business & Networking",
      count: 6,
      checked: false,
    },
  ],

  price: {
    min: 25,
    max: 250,
    currency: "$",
  },
};
