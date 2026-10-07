import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { DollarSign, Search, Ticket, Users } from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import EmptyState from "../../Components/ui/common/EmptyState";
import ErrorState from "../../Components/ui/common/ErrorState";
import StatusBadge from "../../Components/ui/common/StatusBadge";
import StatCard from "../../Components/ui/common/StatCard";
import EventTabs from "./Components/EventTabs";
import {
  clearCurrentEvent,
  getEventBookings,
  getOrganizerEvent,
} from "../../Store/Slices/organizerSlice";
import { formatCurrency, formatedDateTime } from "../../utils/formatedDate";

const STATUS_FILTERS = ["ALL", "CONFIRMED", "PENDING", "CANCELLED"];

export default function EventBookings() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentEvent,
    eventBookings,
    eventBookingsLoading,
    eventBookingsError,
  } = useSelector((state) => state.organizer);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    dispatch(getOrganizerEvent(id));
    dispatch(getEventBookings(id));
    return () => dispatch(clearCurrentEvent());
  }, [dispatch, id]);

  const event = currentEvent?.id === id ? currentEvent : null;

  const summary = useMemo(() => {
    const confirmed = eventBookings.filter((b) => b.status === "CONFIRMED");
    return {
      bookings: confirmed.length,
      tickets: confirmed.reduce((sum, b) => sum + b.quantity, 0),
      revenue: confirmed.reduce((sum, b) => sum + b.totalAmount, 0),
    };
  }, [eventBookings]);

  const visibleBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return eventBookings.filter(
      (booking) =>
        (statusFilter === "ALL" || booking.status === statusFilter) &&
        (!term ||
          booking.user?.name?.toLowerCase().includes(term) ||
          booking.user?.email?.toLowerCase().includes(term) ||
          booking.ticketType?.name?.toLowerCase().includes(term)),
    );
  }, [eventBookings, search, statusFilter]);

  const isLoadingFirst = eventBookingsLoading && eventBookings.length === 0;

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "My Events", to: "/OrganizerDashboard/Events" },
          { label: "Bookings" },
        ]}
        title={event?.title ?? "Event Bookings"}
        description="Attendees and reservations for this event."
        actions={<EventTabs eventId={id} />}
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <StatCard icon={Users} label="Confirmed bookings" value={summary.bookings} loading={isLoadingFirst} />
            <StatCard icon={Ticket} label="Tickets booked" value={summary.tickets} loading={isLoadingFirst} />
            <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(summary.revenue)} loading={isLoadingFirst} />
          </div>

          {/* Toolbar */}
          <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-md flex flex-col md:flex-row md:items-center gap-space-md">
            <label className="flex-1 flex items-center gap-space-xs px-space-sm py-2 rounded-xl bg-surface-container-low border border-border-hairline focus-within:border-primary-ink">
              <Search size={18} strokeWidth={1.5} className="text-outline shrink-0" />
              <span className="sr-only">Search attendees</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search attendee name, email or ticket"
                className="w-full bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-space-xs">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`cursor-pointer px-space-md py-1.5 rounded-full text-label-md capitalize transition-colors ${statusFilter === status ? "bg-primary-ink text-on-primary" : "bg-surface-container-low text-secondary-fill hover:bg-surface-container-high"}`}
                >
                  {status.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {isLoadingFirst ? (
            <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-space-lg space-y-space-md animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-surface-container-high" />
              ))}
            </div>
          ) : eventBookingsError ? (
            <ErrorState
              message={eventBookingsError}
              onRetry={() => dispatch(getEventBookings(id))}
            />
          ) : eventBookings.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No bookings yet"
              description="Once attendees book tickets for this event they will be listed here."
              actionLabel="Back to My Events"
              onAction={() => navigate("/OrganizerDashboard/Events")}
            />
          ) : visibleBookings.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No matching bookings"
              description="Try a different search term or status filter."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            />
          ) : (
            <>
              <div className="hidden md:block bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-hairline text-label-sm uppercase tracking-wider text-muted-dark">
                      <th className="px-space-lg py-space-md font-bold">Attendee</th>
                      <th className="px-space-md py-space-md font-bold">Ticket</th>
                      <th className="px-space-md py-space-md font-bold text-right">Qty</th>
                      <th className="px-space-md py-space-md font-bold text-right">Total</th>
                      <th className="px-space-md py-space-md font-bold">Booked</th>
                      <th className="px-space-lg py-space-md font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {visibleBookings.map((booking) => (
                      <tr key={booking.id} className="text-body-sm text-body-text hover:bg-surface-container-low/60 transition-colors">
                        <td className="px-space-lg py-space-md">
                          <span className="block text-label-lg text-primary-ink">{booking.user?.name}</span>
                          <span className="text-label-md text-muted-dark">{booking.user?.email}</span>
                        </td>
                        <td className="px-space-md py-space-md">{booking.ticketType?.name}</td>
                        <td className="px-space-md py-space-md text-right">{booking.quantity}</td>
                        <td className="px-space-md py-space-md text-right text-label-lg text-primary-ink">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-space-md py-space-md">{formatedDateTime(booking.createdAt)}</td>
                        <td className="px-space-lg py-space-md">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col gap-space-md">
                {visibleBookings.map((booking) => (
                  <article key={booking.id} className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-md space-y-space-sm">
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="min-w-0">
                        <h3 className="text-label-lg text-primary-ink break-words">{booking.user?.name}</h3>
                        <p className="text-label-md text-muted-dark truncate">{booking.user?.email}</p>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center justify-between text-body-sm text-body-text border-t border-border-hairline pt-space-sm">
                      <span>{booking.ticketType?.name} × {booking.quantity}</span>
                      <span className="text-label-lg text-primary-ink">{formatCurrency(booking.totalAmount)}</span>
                    </div>
                    <p className="text-label-md text-muted-dark">{formatedDateTime(booking.createdAt)}</p>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
