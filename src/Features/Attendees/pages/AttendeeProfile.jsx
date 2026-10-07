import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  Heart,
  Mail,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import PageHeader from "../../../Components/ui/common/PageHeader";
import StatCard from "../../../Components/ui/common/StatCard";
import StatusBadge from "../../../Components/ui/common/StatusBadge";
import EventCard from "../../../Components/ui/EventDetails/EventCard";
import { getMyBookings } from "../../../Store/Slices/bookingsSlice";
import {
  formatCurrency,
  formatedDate,
  formatedLocalDate,
  hasEventEnded,
} from "../../../utils/formatedDate";
import { sectionVariantsEaseOut } from "../../../utils/constantsVariants";

function SectionCard({ title, actionLabel, onAction, children }) {
  return (
    <motion.section
      className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-md"
      initial="hidden"
      animate="visible"
      variants={sectionVariantsEaseOut}
    >
      <div className="flex items-center justify-between gap-space-sm">
        <h2 className="text-headline-sm text-primary-ink">{title}</h2>
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="cursor-pointer inline-flex items-center gap-1 text-label-lg text-secondary-fill hover:text-primary-ink transition-colors group"
          >
            {actionLabel}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        )}
      </div>
      {children}
    </motion.section>
  );
}

export default function AttendeeProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useSelector((state) => state.auth);
  const { tickets, loading: ticketsLoading } = useSelector(
    (state) => state.tickets,
  );
  const { bookings, loading: bookingsLoading } = useSelector(
    (state) => state.bookings,
  );
  const { favouriteEvents, events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getMyBookings({ page: 1, limit: 5 }));
  }, [dispatch]);

  const stats = useMemo(() => {
    const activeTickets = tickets.filter(
      (ticket) => ticket.status === "VALID" && !hasEventEnded(ticket.event),
    );
    const upcomingEventIds = new Set(activeTickets.map((t) => t.eventId));
    const pastEventIds = new Set(
      tickets
        .filter((ticket) => ticket.status !== "CANCELLED" && hasEventEnded(ticket.event))
        .map((ticket) => ticket.eventId),
    );
    const nextTickets = [...activeTickets]
      .sort((a, b) => new Date(a.event?.date) - new Date(b.event?.date))
      .slice(0, 3);
    return {
      activeTickets: activeTickets.length,
      upcomingEvents: upcomingEventIds.size,
      pastEvents: pastEventIds.size,
      nextTickets,
    };
  }, [tickets]);

  // recommended: discoverable events the user has no ticket or favourite for
  const recommended = useMemo(() => {
    const owned = new Set([
      ...tickets.map((ticket) => ticket.eventId),
      ...favouriteEvents.map((favourite) => favourite.eventId),
    ]);
    return events
      .filter((event) => !owned.has(event.id) && !hasEventEnded(event))
      .slice(0, 3);
  }, [events, tickets, favouriteEvents]);

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/AttendeeDashboard" },
          { label: "Patron Profile" },
        ]}
        title="Patron Profile"
        description="Your account, activity and upcoming passes at a glance."
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Identity */}
          <motion.div
            className="rounded-3xl bg-surface-deepest text-on-primary p-space-lg md:p-space-xl flex flex-col md:flex-row md:items-center gap-space-lg"
            initial="hidden"
            animate="visible"
            variants={sectionVariantsEaseOut}
          >
            {userLoading && !user?.id ? (
              <div className="flex items-center gap-space-lg animate-pulse">
                <div className="w-20 h-20 rounded-full bg-inverse-surface" />
                <div className="space-y-2">
                  <div className="h-7 w-48 rounded bg-inverse-surface" />
                  <div className="h-4 w-64 rounded bg-inverse-surface" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-surface-container-lowest text-primary-ink flex items-center justify-center text-headline-md shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0 space-y-space-xs">
                  <span className="text-label-sm uppercase tracking-widest text-secondary-fixed-dim">
                    Patron since {user?.createdAt ? formatedLocalDate(user.createdAt) : "—"}
                  </span>
                  <h2 className="text-headline-lg break-words">{user?.name}</h2>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-space-lg gap-y-1 text-body-sm text-secondary-fixed">
                    <span className="flex items-center gap-space-xs min-w-0">
                      <Mail size={16} strokeWidth={1.5} className="shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </span>
                    <span className="flex items-center gap-space-xs">
                      <ShieldCheck size={16} strokeWidth={1.5} />
                      {user?.role === "USER" ? "Attendee" : user?.role?.toLowerCase()}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
            <StatCard
              icon={CalendarClock}
              label="Upcoming events"
              value={stats.upcomingEvents}
              loading={ticketsLoading && !tickets.length}
            />
            <StatCard
              icon={Ticket}
              label="Active tickets"
              value={stats.activeTickets}
              loading={ticketsLoading && !tickets.length}
            />
            <StatCard
              icon={CalendarCheck}
              label="Past events"
              value={stats.pastEvents}
              loading={ticketsLoading && !tickets.length}
            />
            <StatCard icon={Heart} label="Favorites" value={favouriteEvents.length} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg">
            {/* Upcoming tickets */}
            <SectionCard
              title="Upcoming tickets"
              actionLabel="All tickets"
              onAction={() => navigate("/AttendeeDashboard/Tickets")}
            >
              {stats.nextTickets.length === 0 ? (
                <p className="text-body-sm text-body-text py-space-md">
                  No upcoming passes. Your next booking will show here.
                </p>
              ) : (
                <ul className="divide-y divide-border-hairline">
                  {stats.nextTickets.map((ticket) => (
                    <li
                      key={ticket.id}
                      className="py-space-sm flex items-center justify-between gap-space-md"
                    >
                      <div className="min-w-0">
                        <p className="text-label-lg text-primary-ink truncate">
                          {ticket.event?.title}
                        </p>
                        <p className="text-label-md text-muted-dark">
                          {formatedDate(ticket.event?.date)} · {ticket.ticketType?.name}
                        </p>
                      </div>
                      <StatusBadge status={ticket.status} />
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {/* Recent bookings */}
            <SectionCard
              title="Recent bookings"
              actionLabel="Booking history"
              onAction={() => navigate("/AttendeeDashboard/BookingHistory")}
            >
              {bookingsLoading && !bookings.length ? (
                <div className="space-y-space-sm animate-pulse">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-10 rounded-lg bg-surface-container-high" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <p className="text-body-sm text-body-text py-space-md">
                  You have not booked any events yet.
                </p>
              ) : (
                <ul className="divide-y divide-border-hairline">
                  {bookings.slice(0, 5).map((booking) => (
                    <li
                      key={booking.id}
                      className="py-space-sm flex items-center justify-between gap-space-md"
                    >
                      <div className="min-w-0">
                        <p className="text-label-lg text-primary-ink truncate">
                          {booking.event?.title}
                        </p>
                        <p className="text-label-md text-muted-dark">
                          {formatedLocalDate(booking.createdAt)} · {booking.quantity} ×{" "}
                          {booking.ticketType?.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-label-lg text-primary-ink">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                        <StatusBadge status={booking.status} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>

          {/* Recommended */}
          {recommended.length > 0 && (
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h2 className="text-headline-sm text-primary-ink">
                  Recommended for you
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/AttendeeDashboard/DiscoverEvents")}
                  className="cursor-pointer inline-flex items-center gap-1 text-label-lg text-secondary-fill hover:text-primary-ink transition-colors"
                >
                  Discover more <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                {recommended.map((event) => (
                  <EventCard data={event} key={event.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
