import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Compass,
  ExternalLink,
  History,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";
import PageHeader from "../../../Components/ui/common/PageHeader";
import EmptyState from "../../../Components/ui/common/EmptyState";
import ErrorState from "../../../Components/ui/common/ErrorState";
import StatusBadge from "../../../Components/ui/common/StatusBadge";
import EventPagination from "../../../Components/ui/EventDetails/EventPagination";
import {
  cancelBooking,
  getMyBookings,
} from "../../../Store/Slices/bookingsSlice";
import {
  formatCurrency,
  formatedDate,
  formatedLocalDate,
  hasEventEnded,
} from "../../../utils/formatedDate";
import {
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from "../../../utils/sweetAlertNotifications";
import { sectionVariantsEaseOut } from "../../../utils/constantsVariants";

const BOOKINGS_PER_PAGE = 10;

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest booking" },
  { value: "oldest", label: "Oldest booking" },
  { value: "eventDate", label: "Event date" },
  { value: "totalDesc", label: "Highest total" },
];

const bookingRef = (id) => `EV-${id?.slice(-8).toUpperCase()}`;

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  eventDate: (a, b) => new Date(a.event?.date) - new Date(b.event?.date),
  totalDesc: (a, b) => b.totalAmount - a.totalAmount,
};

export default function BookingHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, pagination, loading, error, cancelingId } = useSelector(
    (state) => state.bookings,
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    dispatch(getMyBookings({ page: 1, limit: BOOKINGS_PER_PAGE }));
  }, [dispatch]);

  // search / filter / sort apply to the loaded page
  const visibleBookings = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookings
      .filter((booking) =>
        statusFilter === "ALL" ? true : booking.status === statusFilter,
      )
      .filter((booking) =>
        term
          ? booking.event?.title?.toLowerCase().includes(term) ||
            bookingRef(booking.id).toLowerCase().includes(term) ||
            booking.ticketType?.name?.toLowerCase().includes(term)
          : true,
      )
      .sort(sorters[sort]);
  }, [bookings, search, statusFilter, sort]);

  const canCancel = (booking) =>
    booking.status !== "CANCELLED" &&
    !hasEventEnded(booking.event) &&
    !booking.tickets?.some((ticket) => ticket.status === "USED");

  const handleCancel = async (booking) => {
    const confirmed = await showConfirmDialog({
      title: "Cancel booking?",
      message: `${booking.quantity} ticket(s) for "${booking.event?.title}" will be invalidated. This can not be undone.`,
      confirmText: "Cancel Booking",
      cancelText: "Keep Booking",
      danger: true,
    });
    if (!confirmed) return;
    const result = await dispatch(cancelBooking(booking.id));
    if (cancelBooking.fulfilled.match(result)) {
      showSuccessAlert("Booking cancelled", "Your tickets have been released.");
    } else {
      showErrorAlert("Can not cancel", result.payload?.message);
    }
  };

  const handlePageChange = (page) => {
    dispatch(getMyBookings({ page, limit: BOOKINGS_PER_PAGE }));
  };

  const renderActions = (booking) => (
    <div className="flex items-center justify-end gap-space-xs">
      <button
        type="button"
        onClick={() => navigate(`/Eventdetails/${booking.eventId}`)}
        aria-label="View event"
        title="View event"
        className="cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center text-secondary-fill hover:bg-surface-container-low transition-colors"
      >
        <ExternalLink size={16} strokeWidth={1.5} />
      </button>
      {canCancel(booking) && (
        <button
          type="button"
          onClick={() => handleCancel(booking)}
          disabled={cancelingId === booking.id}
          className="cursor-pointer inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-xl text-label-md text-error hover:bg-error-container/40 transition-colors disabled:opacity-50"
        >
          {cancelingId === booking.id ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <XCircle size={14} strokeWidth={1.5} />
          )}
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/AttendeeDashboard" },
          { label: "Booking History" },
        ]}
        title="Booking History"
        description={`${pagination.total} booking${pagination.total === 1 ? "" : "s"} on your account`}
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Toolbar */}
          <motion.div
            className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-md flex flex-col lg:flex-row gap-space-md lg:items-center"
            initial="hidden"
            animate="visible"
            variants={sectionVariantsEaseOut}
          >
            <label className="flex-1 flex items-center gap-space-xs px-space-sm py-2 rounded-xl bg-surface-container-low border border-border-hairline focus-within:border-primary-ink">
              <Search size={18} strokeWidth={1.5} className="text-outline shrink-0" />
              <span className="sr-only">Search bookings</span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by event, ticket or booking ID"
                className="w-full bg-transparent text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-space-xs">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`cursor-pointer px-space-md py-1.5 rounded-full text-label-md transition-colors ${statusFilter === filter.value ? "bg-primary-ink text-on-primary" : "bg-surface-container-low text-secondary-fill hover:bg-surface-container-high"}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-space-xs text-label-md text-secondary-fill">
              <ArrowUpDown size={16} strokeWidth={1.5} />
              <span className="sr-only">Sort bookings</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="cursor-pointer bg-surface-container-low border border-border-hairline rounded-xl px-space-sm py-2 text-body-sm text-on-surface focus:outline-none focus:border-primary-ink"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </motion.div>

          {loading && bookings.length === 0 ? (
            <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-space-lg space-y-space-md animate-pulse">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-10 rounded-lg bg-surface-container-high" />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() =>
                dispatch(getMyBookings({ page: pagination.page, limit: BOOKINGS_PER_PAGE }))
              }
            />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={History}
              title="No bookings yet"
              description="When you book tickets, every reservation is recorded here."
              actionLabel="Discover Events"
              actionIcon={Compass}
              onAction={() => navigate("/AttendeeDashboard/DiscoverEvents")}
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
              {/* Desktop table */}
              <div className="hidden md:block bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-hairline text-label-sm uppercase tracking-wider text-muted-dark">
                      <th className="px-space-lg py-space-md font-bold">Booking</th>
                      <th className="px-space-md py-space-md font-bold">Event</th>
                      <th className="px-space-md py-space-md font-bold">Ticket</th>
                      <th className="px-space-md py-space-md font-bold text-right">Qty</th>
                      <th className="px-space-md py-space-md font-bold text-right">Total</th>
                      <th className="px-space-md py-space-md font-bold">Status</th>
                      <th className="px-space-lg py-space-md font-bold text-right">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {visibleBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="text-body-sm text-body-text hover:bg-surface-container-low/60 transition-colors"
                      >
                        <td className="px-space-lg py-space-md">
                          <span className="block text-label-lg text-primary-ink">
                            {bookingRef(booking.id)}
                          </span>
                          <span className="text-label-md text-muted-dark">
                            {formatedLocalDate(booking.createdAt)}
                          </span>
                        </td>
                        <td className="px-space-md py-space-md max-w-xs">
                          <span className="block text-label-lg text-primary-ink truncate">
                            {booking.event?.title}
                          </span>
                          <span className="text-label-md text-muted-dark">
                            {formatedDate(booking.event?.date)}
                          </span>
                        </td>
                        <td className="px-space-md py-space-md">
                          {booking.ticketType?.name}
                        </td>
                        <td className="px-space-md py-space-md text-right">
                          {booking.quantity}
                        </td>
                        <td className="px-space-md py-space-md text-right text-label-lg text-primary-ink">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-space-md py-space-md">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-space-lg py-space-md">
                          {renderActions(booking)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden flex flex-col gap-space-md">
                {visibleBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-md space-y-space-sm"
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="min-w-0">
                        <span className="block text-label-sm uppercase tracking-wider text-muted-dark">
                          {bookingRef(booking.id)} · {formatedLocalDate(booking.createdAt)}
                        </span>
                        <h3 className="text-label-lg text-primary-ink break-words">
                          {booking.event?.title}
                        </h3>
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="flex items-center justify-between text-body-sm text-body-text border-t border-border-hairline pt-space-sm">
                      <span>
                        {booking.ticketType?.name} × {booking.quantity}
                      </span>
                      <span className="text-label-lg text-primary-ink">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>
                    {renderActions(booking)}
                  </article>
                ))}
              </div>
            </>
          )}

          <EventPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      </section>
    </div>
  );
}
