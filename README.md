# EventVerse Frontend

> A modern event discovery, booking, ticketing, and event-management platform built with React and a RESTful backend.

## 🔐 Default Demo Accounts

| Role | Email | Password |
|---|---|---|
| **Organizer** | `organizer@eventverse.dev` | `Password123!` |
| **User / Attendee** | `user@eventverse.dev` | `Password123!` |

> **Note:** These are development/demo credentials. Do not use them as real production credentials.

## 📖 Project Overview

**EventVerse** is a full-featured event platform designed to connect attendees with curated events while giving organizers the tools they need to create, publish, manage, and analyze their events.

The frontend provides two main experiences:

### Attendee / User Experience

Users can:
- Discover published events.
- Search and filter events.
- View detailed event information.
- Browse available ticket types.
- Select ticket quantities and create bookings.
- View booking history.
- Access purchased tickets and QR credentials.
- Save and manage favorite events.
- Read and submit event reviews.
- Manage their attendee dashboard.
- View their account information.

### Organizer Experience

Organizers can:
- View organizer dashboard analytics.
- Create, edit, publish, draft, and delete events.
- Manage ticket types.
- View bookings for their events.
- View event-level and organizer-level analytics.
- Validate ticket credentials.
- Check attendees in.

## ✨ Main Benefits

### 1. Complete Event Lifecycle

EventVerse supports the flow from event creation to attendee check-in:

```text
Organizer → Create Event → Add Ticket Types → Publish Event
        ↓
Attendee → Discover Event → Select Tickets → Create Booking
        ↓
Ticket + QR Credential → Organizer Validation → Check-in
```

### 2. Clear Role Separation

The application separates attendee and organizer workflows, keeping each experience focused on its relevant tasks.

### 3. Centralized State Management

Redux Toolkit and async thunks follow the project flow:

```text
UI → Redux Thunk → API Service → Backend API → Thunk Response → Redux State → UI
```

This keeps API communication and UI state changes predictable and maintainable.

### 4. Reusable Architecture

The frontend is organized around reusable components, feature pages, services, layouts, and Redux slices, making the application easier to maintain and extend.

### 5. Production-Oriented API Integration

A shared Axios API layer provides a centralized base URL, automatic bearer-token handling, and consistent API error handling.

### 6. Strong User Experience

The application includes loading states, error states, empty states, confirmation flows, responsive layouts, ticket summaries, QR ticket display, search/filtering, and favorite-event interactions.

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React** | UI development |
| **Vite** | Development server and build tooling |
| **JavaScript / JSX** | Application development |
| **Tailwind CSS** | Styling and responsive UI |
| **Redux Toolkit** | Global state management |
| **React Redux** | Connecting React components to Redux |
| **Redux Thunk** | Asynchronous API/state workflows |
| **React Router** | Client-side routing |
| **Axios** | REST API communication |
| **Lucide React** | Interface icons |

### Backend Integration

The frontend consumes the existing EventVerse REST API through:

- Authentication
- Events
- Categories
- Bookings
- Tickets
- Favorites
- Reviews
- Organizer management
- Ticket types
- Organizer analytics
- Ticket validation and check-in

The backend is treated as an existing service and is **not included or modified in this frontend project**.

### Backend / Data Technologies

The frontend is designed to work with the existing backend architecture using:

- **Node.js**
- **Express**
- **MongoDB**
- **Prisma**
- REST API architecture

## 🏗️ Frontend Architecture

```text
src/
├── Components/
├── Features/
│   ├── Attendees/
│   ├── Authentication/
│   ├── Events/
│   └── Organizer/
├── Pages/
├── Services/
│   ├── api.js
│   ├── authServices.js
│   ├── eventsServices.js
│   ├── bookingServices.js
│   ├── ticketServices.js
│   ├── reviewServices.js
│   └── organizerServices.js
├── Store/
│   ├── Slices/
│   │   ├── authSlice.js
│   │   ├── eventsSlice.js
│   │   ├── bookingSlice.js
│   │   ├── ticketSlice.js
│   │   ├── reviewSlice.js
│   │   └── organizerSlice.js
│   └── store.js
├── Router/
└── index.css
```

## 🔄 API and Redux Flow

A typical EventVerse operation follows this pattern:

```text
Ticket Selection UI
        ↓
createBooking() thunk
        ↓
bookingServices.js
        ↓
POST /api/v1/bookings
        ↓
Backend
        ↓
Thunk receives response
        ↓
bookingSlice updates state
        ↓
React UI re-renders
```

The same pattern is used for events, bookings, tickets, favorites, reviews, organizer management, analytics, validation, and check-in.

## 👤 Attendee Modules

### Dashboard

The attendee dashboard provides upcoming tickets, active tickets, past events, favorite events, recent bookings, and curated events.

### My Tickets

Users can view purchased tickets, separate upcoming/past tickets, open QR credentials, and access ticket information.

### Booking History

Users can search bookings, filter booking status, review totals, and cancel eligible bookings.

### Favorites

Users can view saved events, remove favorites, and navigate to event details.

### Reviews

Users can read reviews, submit reviews, and delete their own reviews.

## 🏢 Organizer Modules

### Organizer Dashboard

Provides event statistics, organizer analytics, ticket validation, and attendee check-in.

### Event Management

Organizers can create, edit, delete, draft, publish, and configure events and ticket types.

### Analytics

Organizer analytics provide insight into organizer-level performance, individual event performance, and event bookings.

### Check-in

Organizers can validate ticket credentials and perform attendee check-in using the ticket validation/check-in APIs.

## 🎨 Design System

EventVerse follows the project's **Warm Stone Editorial** design direction.

The design emphasizes:

- Minimalism
- Editorial presentation
- Warm neutral colors
- Strong typography
- Spacious layouts
- Clear hierarchy
- Subtle borders and shadows
- Rounded cards and controls

The frontend follows the project's existing design tokens for colors, typography, spacing, borders, radius, layout widths, and responsive behavior.

## 📱 Responsive Design

The interface is designed for desktop, laptop, tablet, and mobile screen sizes using responsive layout and spacing utilities.

## 🔐 Authentication

Authentication is handled through the backend API and supports:

- Registration
- Login
- Current-user retrieval
- Logout

The frontend stores the authenticated token locally and automatically attaches the bearer token to authenticated API requests through the shared Axios interceptor.

## 🌐 Environment Configuration

The default API URL is:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

If required, create a `.env` file in the frontend root:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure the API URL

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start Development

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

## 🔌 Backend API Areas Used

```text
Authentication
├── Register
├── Login
├── Current User
└── Logout

Events
├── List
├── Create
├── Details
├── Update
└── Delete

Categories
└── List

Bookings
├── Create
├── My Bookings
├── Booking Details
└── Cancel

Tickets
├── My Tickets
├── Ticket Details
├── QR
├── Validate
└── Check-in

Favorites
├── List
├── Add
└── Remove

Reviews
├── List
├── Create
└── Delete

Organizer
├── Events
├── Event Details
├── Event Bookings
├── Event Analytics
└── Organizer Analytics

Ticket Types
├── Create
├── Update
└── Delete
```

## 🗺️ Map / Location Integration

Mapbox integration is intentionally **not implemented in this frontend version**, according to the project requirement.

The event API still expects location-related fields such as `venue`, `address`, `latitude`, and `longitude`. The organizer event form therefore supports the required location data without adding Mapbox UI or Mapbox SDK functionality.

## 🧪 Project Quality

The completed frontend was checked for JavaScript/JSX syntax errors, broken relative imports, placeholder development logs, unfinished placeholder pages, unused map SDK integration, and consistency between Redux slices and API services.

## 📌 Important Notes

1. The backend project is separate from this frontend project.
2. The frontend expects the backend to be running and accessible through `VITE_API_URL`.
3. Demo credentials are intended for development/testing only.
4. Mapbox/Map UI is intentionally excluded.
5. The frontend does not modify the backend implementation.
6. Profile editing is not included because the available backend API does not provide a profile-update endpoint.
7. Production deployments should use secure environment variables and production credentials.

## 🎯 Project Goal

EventVerse aims to provide a clean, scalable, and modern platform where **attendees discover and experience events** while **organizers create, manage, and measure events**.

The architecture is designed to make future features easier to add while keeping the current application simple, maintainable, and consistent with the EventVerse design system.

## 📄 Project Status

| Area | Status |
|---|---|
| Frontend | **Completed** |
| Backend Integration | **Integrated** |
| Authentication | **Integrated** |
| Event Discovery | **Integrated** |
| Event Details | **Integrated** |
| Bookings | **Integrated** |
| Tickets & QR | **Integrated** |
| Favorites | **Integrated** |
| Reviews | **Integrated** |
| Organizer Management | **Integrated** |
| Analytics | **Integrated** |
| Ticket Validation & Check-in | **Integrated** |
| Mapbox | **Intentionally not implemented** |
