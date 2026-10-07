import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Plus,
  ScanLine,
  Ticket,
  Users,
} from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import StatCard from "../../Components/ui/common/StatCard";
import StatusBadge from "../../Components/ui/common/StatusBadge";
import ErrorState from "../../Components/ui/common/ErrorState";
import {
  getOrganizerAnalytics,
  getOrganizerEvents,
} from "../../Store/Slices/organizerSlice";
import {
  formatCurrency,
  formatedDate,
  hasEventEnded,
} from "../../utils/formatedDate";
import { sectionVariantsEaseOut } from "../../utils/constantsVariants";

const soldOf = (event) =>
  (event.ticketTypes ?? []).reduce(
    (sum, t) => sum + (t.totalQuantity - t.availableQuantity),
    0,
  );
const capacityOf = (event) =>
  (event.ticketTypes ?? []).reduce((sum, t) => sum + t.totalQuantity, 0);

function Panel({ title, actionLabel, onAction, children, className = "" }) {
  return (
    <motion.section
      className={`bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-md ${className}`}
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
            className="cursor-pointer inline-flex items-center gap-1 text-label-lg text-secondary-fill hover:text-primary-ink transition-colors"
          >
            {actionLabel} <ArrowRight size={16} />
          </button>
        )}
      </div>
      {children}
    </motion.section>
  );
}

export default function OverView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    analytics,
    analyticsLoading,
    analyticsError,
    events,
    eventsLoading,
    pagination,
  } = useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(getOrganizerAnalytics());
    // deduped by the thunk condition when the layout is already loading it
    dispatch(getOrganizerEvents({ page: 1, limit: 10 }));
  }, [dispatch]);

  const { upcomingEvents, topEvents, statusCounts } = useMemo(() => {
    const live = events.filter(
      (event) =>
        ["UPCOMING", "PUBLISHED"].includes(event.status) && !hasEventEnded(event),
    );
    const counts = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      upcomingEvents: [...live].sort((a, b) => new Date(a.date) - new Date(b.date)),
      topEvents: [...events]
        .filter((event) => capacityOf(event) > 0)
        .sort((a, b) => soldOf(b) - soldOf(a))
        .slice(0, 5),
      statusCounts: counts,
    };
  }, [events]);

  const loadingStats = analyticsLoading && !analytics;
  const checkInRate = analytics?.ticketsSold
    ? Math.round((analytics.ticketsCheckedIn / analytics.ticketsSold) * 1000) / 10
    : 0;

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }, { label: "Overview" }]}
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="How your events are performing across EventVerse."
        actions={
          <>
            <button
              type="button"
              onClick={() => navigate("/OrganizerDashboard/CheckIn")}
              className="cursor-pointer inline-flex items-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-md py-2.5 rounded-xl hover:bg-surface-container-lowest hover:border-muted-dark transition-colors"
            >
              <ScanLine size={16} strokeWidth={1.5} />
              Check-in
            </button>
            <button
              type="button"
              onClick={() => navigate("/OrganizerDashboard/AddEvent")}
              className="cursor-pointer inline-flex items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-md py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors"
            >
              <Plus size={16} />
              Create Event
            </button>
          </>
        }
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {analyticsError ? (
            <ErrorState
              message={analyticsError}
              onRetry={() => dispatch(getOrganizerAnalytics())}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
              <StatCard
                icon={CalendarDays}
                label="Total events"
                value={analytics?.totalEvents ?? 0}
                loading={loadingStats}
              />
              <StatCard
                icon={Users}
                label="Total bookings"
                value={analytics?.totalBookings ?? 0}
                hint="Confirmed reservations"
                loading={loadingStats}
              />
              <StatCard
                icon={DollarSign}
                label="Revenue"
                value={formatCurrency(analytics?.totalRevenue)}
                loading={loadingStats}
              />
              <StatCard
                icon={CalendarClock}
                label="Upcoming events"
                value={upcomingEvents.length}
                hint={pagination.totalPages > 1 ? "From your latest events" : undefined}
                loading={eventsLoading && !events.length}
              />
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-space-lg">
            {/* Booking overview */}
            <Panel title="Booking overview">
              {loadingStats ? (
                <div className="h-40 rounded-xl bg-surface-container-high animate-pulse" />
              ) : (
                <div className="flex flex-col gap-space-md">
                  <div className="grid grid-cols-2 gap-space-md">
                    <div className="p-space-md rounded-xl bg-surface-container-low">
                      <span className="flex items-center gap-1 text-label-sm uppercase tracking-wider text-muted-dark">
                        <Ticket size={14} strokeWidth={1.5} /> Sold
                      </span>
                      <span className="text-headline-md text-primary-ink">
                        {analytics?.ticketsSold ?? 0}
                      </span>
                    </div>
                    <div className="p-space-md rounded-xl bg-surface-container-low">
                      <span className="flex items-center gap-1 text-label-sm uppercase tracking-wider text-muted-dark">
                        <CheckCircle2 size={14} strokeWidth={1.5} /> Checked in
                      </span>
                      <span className="text-headline-md text-primary-ink">
                        {analytics?.ticketsCheckedIn ?? 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-label-md text-secondary-fill mb-1">
                      <span>Attendance rate</span>
                      <span>{checkInRate}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className="h-full rounded-full bg-success transition-all duration-700"
                        style={{ width: `${checkInRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-space-xs pt-space-xs border-t border-border-hairline">
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <StatusBadge
                        key={status}
                        status={status}
                        label={`${count} ${status === "ARCHIVED" ? "ended" : status.toLowerCase()}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Panel>

            {/* Top events */}
            <Panel
              title="Top events"
              actionLabel="All events"
              onAction={() => navigate("/OrganizerDashboard/Events")}
              className="xl:col-span-2"
            >
              {eventsLoading && !events.length ? (
                <div className="space-y-space-sm animate-pulse">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg bg-surface-container-high" />
                  ))}
                </div>
              ) : topEvents.length === 0 ? (
                <div className="py-space-lg text-center">
                  <p className="text-label-lg text-primary-ink">No ticket sales yet</p>
                  <p className="text-body-sm text-body-text">
                    Create an event with ticket types and publish it to start selling.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-space-md">
                  {topEvents.map((event) => {
                    const sold = soldOf(event);
                    const capacity = capacityOf(event);
                    const percent = Math.round((sold / capacity) * 100);
                    return (
                      <li key={event.id}>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/OrganizerDashboard/Events/${event.id}/Analytics`)
                          }
                          className="cursor-pointer w-full text-left space-y-1.5 group"
                        >
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="text-label-lg text-primary-ink truncate group-hover:underline">
                              {event.title}
                            </span>
                            <span className="text-label-md text-secondary-fill shrink-0">
                              {sold} / {capacity}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary-ink"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          </div>

          {/* Upcoming schedule */}
          <Panel
            title="Upcoming schedule"
            actionLabel="Manage"
            onAction={() => navigate("/OrganizerDashboard/Events")}
          >
            {upcomingEvents.length === 0 ? (
              <p className="text-body-sm text-body-text py-space-sm">
                Nothing scheduled. Your next event will appear here.
              </p>
            ) : (
              <ul className="divide-y divide-border-hairline">
                {upcomingEvents.slice(0, 5).map((event) => (
                  <li
                    key={event.id}
                    className="py-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm"
                  >
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex flex-col items-center justify-center shrink-0">
                        <span className="text-label-sm uppercase text-muted-dark">
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}
                        </span>
                        <span className="text-label-lg text-primary-ink">
                          {new Date(event.date).getUTCDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-label-lg text-primary-ink truncate">{event.title}</p>
                        <p className="text-label-md text-muted-dark truncate">
                          {formatedDate(event.date)} · {event.startTime} · {event.venue}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-sm shrink-0">
                      <StatusBadge status={event.status} />
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/OrganizerDashboard/Events/${event.id}/Bookings`)
                        }
                        className="cursor-pointer text-label-md text-secondary-fill hover:text-primary-ink underline"
                      >
                        Bookings
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}
