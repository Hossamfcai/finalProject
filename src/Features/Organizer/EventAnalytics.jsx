import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  DollarSign,
  ScanLine,
  SearchX,
  Ticket,
  Users,
} from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import ErrorState from "../../Components/ui/common/ErrorState";
import EmptyState from "../../Components/ui/common/EmptyState";
import StatCard from "../../Components/ui/common/StatCard";
import StatusBadge from "../../Components/ui/common/StatusBadge";
import EventTabs from "./Components/EventTabs";
import {
  getEventAnalytics,
  getOrganizerEvent,
} from "../../Store/Slices/organizerSlice";
import { formatCurrency, formatedDate } from "../../utils/formatedDate";
import { sectionVariantsEaseOut } from "../../utils/constantsVariants";

export default function EventAnalytics() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentEvent,
    currentEventError,
    eventAnalytics,
    eventAnalyticsLoading,
    eventAnalyticsError,
  } = useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(getOrganizerEvent(id));
    dispatch(getEventAnalytics(id));
  }, [dispatch, id]);

  const event = currentEvent?.id === id ? currentEvent : null;
  const analytics = eventAnalytics?.eventId === id ? eventAnalytics : null;
  const loading = eventAnalyticsLoading && !analytics;

  const inventory = (event?.ticketTypes ?? []).map((ticketType) => {
    const sold = ticketType.totalQuantity - ticketType.availableQuantity;
    return {
      ...ticketType,
      sold,
      percent: ticketType.totalQuantity
        ? Math.round((sold / ticketType.totalQuantity) * 100)
        : 0,
    };
  });
  const capacity = inventory.reduce((sum, t) => sum + t.totalQuantity, 0);

  const retry = () => {
    dispatch(getOrganizerEvent(id));
    dispatch(getEventAnalytics(id));
  };

  if (currentEventError?.status === 403 || currentEventError?.status === 404) {
    return (
      <div className="w-full bg-background px-gutter-mobile sm:px-gutter py-space-xl">
        <EmptyState
          icon={SearchX}
          title={currentEventError.status === 403 ? "Not your event" : "Event not found"}
          description={currentEventError.message}
          actionLabel="Back to My Events"
          onAction={() => navigate("/OrganizerDashboard/Events")}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "My Events", to: "/OrganizerDashboard/Events" },
          { label: "Analytics" },
        ]}
        title={event?.title ?? "Event Analytics"}
        description={
          event
            ? `${formatedDate(event.date)} · ${event.startTime} – ${event.endTime} · ${event.venue}`
            : "Performance of this event."
        }
        actions={<EventTabs eventId={id} />}
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {eventAnalyticsError ? (
            <ErrorState message={eventAnalyticsError} onRetry={retry} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
                <StatCard icon={Users} label="Confirmed bookings" value={analytics?.totalBookings ?? 0} loading={loading} />
                <StatCard icon={DollarSign} label="Revenue" value={formatCurrency(analytics?.totalRevenue)} loading={loading} />
                <StatCard
                  icon={Ticket}
                  label="Tickets sold"
                  value={analytics?.ticketsSold ?? 0}
                  hint={capacity ? `of ${capacity} capacity` : undefined}
                  loading={loading}
                />
                <StatCard icon={CheckCircle2} label="Checked in" value={analytics?.ticketsCheckedIn ?? 0} loading={loading} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-space-lg">
                {/* Check-in rate */}
                <motion.section
                  className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-md"
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariantsEaseOut}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-headline-sm text-primary-ink">Check-in rate</h2>
                    {event && <StatusBadge status={event.status} />}
                  </div>
                  {loading ? (
                    <div className="h-24 rounded-xl bg-surface-container-high animate-pulse" />
                  ) : (
                    <>
                      <span className="text-display-hero-mobile text-primary-ink">
                        {analytics?.checkInRate ?? 0}%
                      </span>
                      <div
                        className="h-3 rounded-full bg-surface-container-high overflow-hidden"
                        role="progressbar"
                        aria-valuenow={analytics?.checkInRate ?? 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className="h-full rounded-full bg-success transition-all duration-700"
                          style={{ width: `${analytics?.checkInRate ?? 0}%` }}
                        />
                      </div>
                      <p className="text-body-sm text-body-text">
                        {analytics?.ticketsCheckedIn ?? 0} of {analytics?.ticketsSold ?? 0} sold tickets scanned at the gate.
                      </p>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate("/OrganizerDashboard/CheckIn")}
                    className="cursor-pointer mt-auto inline-flex items-center justify-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-md py-2.5 rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
                  >
                    <ScanLine size={16} strokeWidth={1.5} />
                    Open check-in
                  </button>
                </motion.section>

                {/* Inventory per ticket type */}
                <motion.section
                  className="xl:col-span-2 bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-md"
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariantsEaseOut}
                >
                  <h2 className="text-headline-sm text-primary-ink">Sales by ticket type</h2>
                  {!event ? (
                    <div className="space-y-space-md animate-pulse">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-lg bg-surface-container-high" />
                      ))}
                    </div>
                  ) : inventory.length === 0 ? (
                    <p className="text-body-sm text-body-text py-space-md">
                      No ticket types yet. Add them from the edit page.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-space-md">
                      {inventory.map((ticketType) => (
                        <li key={ticketType.id} className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-space-sm">
                            <span className="text-label-lg text-primary-ink">
                              {ticketType.name}
                              <span className="ml-2 text-label-md text-muted-dark">
                                {formatCurrency(ticketType.price)}
                              </span>
                            </span>
                            <span className="text-label-md text-secondary-fill">
                              {ticketType.sold} / {ticketType.totalQuantity} · {ticketType.percent}%
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${ticketType.availableQuantity === 0 ? "bg-warning" : "bg-primary-ink"}`}
                              style={{ width: `${ticketType.percent}%` }}
                            />
                          </div>
                          <span className="text-label-md text-muted-dark">
                            {ticketType.availableQuantity === 0
                              ? "Sold out"
                              : `${ticketType.availableQuantity} remaining · ${formatCurrency(ticketType.sold * ticketType.price)} gross`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
