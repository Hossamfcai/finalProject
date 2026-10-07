import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Compass, MapPin, QrCode, Ticket } from "lucide-react";
import PageHeader from "../../../Components/ui/common/PageHeader";
import EmptyState from "../../../Components/ui/common/EmptyState";
import ErrorState from "../../../Components/ui/common/ErrorState";
import StatusBadge from "../../../Components/ui/common/StatusBadge";
import Modal from "../../../Components/ui/common/Modal";
import DigitalTicket from "../../../Components/ui/Tickets/DigitalTicket";
import EventPagination from "../../../Components/ui/EventDetails/EventPagination";
import { getMyTickets } from "../../../Store/Slices/ticketsSlice";
import { formatedDate, hasEventEnded } from "../../../utils/formatedDate";
import { cardVariants } from "../../../utils/constantsVariants";
import defaultImage from "../../../assets/images/event_defaultImg.png";

const TICKETS_PER_PAGE = 100;

const isUpcomingTicket = (ticket) =>
  ticket.status === "VALID" && !hasEventEnded(ticket.event);

function TicketRow({ ticket, onView }) {
  const upcoming = isUpcomingTicket(ticket);
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low hover:shadow-hover transition-shadow overflow-hidden flex flex-col sm:flex-row"
    >
      <div className="sm:w-48 aspect-[16/10] sm:aspect-auto bg-surface-container shrink-0">
        <img
          src={ticket.event?.imageUrl || defaultImage}
          alt=""
          className={`w-full h-full object-cover ${upcoming ? "" : "grayscale"}`}
        />
      </div>
      <div className="flex-1 min-w-0 p-space-lg flex flex-col gap-space-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="text-label-sm uppercase tracking-wider text-muted-dark">
            {ticket.ticketType?.name}
          </span>
          <StatusBadge status={ticket.status} />
        </div>
        <h3 className="text-headline-sm text-primary-ink break-words">
          {ticket.event?.title}
        </h3>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-space-lg gap-y-1 text-body-sm text-body-text">
          <span className="flex items-center gap-space-xs">
            <CalendarDays size={16} strokeWidth={1.5} />
            {formatedDate(ticket.event?.date)} · {ticket.event?.startTime}
          </span>
          {upcoming && (
            <span className="flex items-center gap-space-xs min-w-0">
              <MapPin size={16} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{ticket.event?.venue}</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-space-sm px-space-lg pb-space-lg sm:p-space-lg sm:border-l border-dashed border-muted-light">
        <div className="text-left sm:text-center">
          <span className="block text-label-sm uppercase tracking-wider text-muted-dark">
            Booking
          </span>
          <span className="text-label-lg text-primary-ink">
            EV-{ticket.bookingId?.slice(-8).toUpperCase()}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onView(ticket)}
          className="cursor-pointer inline-flex items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-md py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors whitespace-nowrap"
        >
          <QrCode size={16} strokeWidth={1.5} />
          View Ticket
        </button>
      </div>
    </motion.article>
  );
}

function TicketRowSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl overflow-hidden flex flex-col sm:flex-row animate-pulse">
      <div className="sm:w-48 aspect-[16/10] sm:aspect-auto sm:h-36 bg-surface-container-high" />
      <div className="flex-1 p-space-lg space-y-3">
        <div className="h-3 w-24 rounded bg-surface-container-high" />
        <div className="h-6 w-2/3 rounded bg-surface-container-high" />
        <div className="h-4 w-1/2 rounded bg-surface-container-high" />
      </div>
    </div>
  );
}

export default function Tickets() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, pagination, loading, error } = useSelector(
    (state) => state.tickets,
  );
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    // always refresh: a booking made on the details page issues new tickets
    dispatch(getMyTickets({ page: 1, limit: TICKETS_PER_PAGE }));
  }, [dispatch]);

  const { upcoming, past } = useMemo(() => {
    const groups = { upcoming: [], past: [] };
    tickets.forEach((ticket) => {
      groups[isUpcomingTicket(ticket) ? "upcoming" : "past"].push(ticket);
    });
    // upcoming: soonest first, past: most recent first
    groups.upcoming.sort((a, b) => new Date(a.event?.date) - new Date(b.event?.date));
    groups.past.sort((a, b) => new Date(b.event?.date) - new Date(a.event?.date));
    return groups;
  }, [tickets]);

  const visible = activeTab === "upcoming" ? upcoming : past;
  const tabs = [
    { key: "upcoming", label: "Upcoming", count: upcoming.length },
    { key: "past", label: "Past & Inactive", count: past.length },
  ];

  const handlePageChange = (page) => {
    dispatch(getMyTickets({ page, limit: TICKETS_PER_PAGE }));
  };

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/AttendeeDashboard" },
          { label: "My Tickets" },
        ]}
        title="My Tickets"
        description="Your digital passes. Present the QR code at the venue gate."
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Tabs */}
          <div
            role="tablist"
            className="inline-flex self-start gap-space-xs p-space-xs rounded-full bg-surface-container-low border border-border-hairline"
          >
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer inline-flex items-center gap-space-xs px-space-md py-2 rounded-full text-label-lg transition-colors ${activeTab === tab.key ? "bg-primary-ink text-on-primary" : "text-secondary-fill hover:bg-surface-container"}`}
              >
                {tab.label}
                <span
                  className={`text-label-sm px-2 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-surface-container-high"}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {loading && tickets.length === 0 ? (
            <div className="flex flex-col gap-space-md">
              {Array.from({ length: 3 }).map((_, index) => (
                <TicketRowSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={() =>
                dispatch(getMyTickets({ page: pagination.page, limit: TICKETS_PER_PAGE }))
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title={
                activeTab === "upcoming"
                  ? "No upcoming tickets"
                  : "No past tickets yet"
              }
              description={
                activeTab === "upcoming"
                  ? "Book an event and your digital passes will appear here."
                  : "Tickets for events you attended, and cancelled tickets, show up here."
              }
              actionLabel="Discover Events"
              actionIcon={Compass}
              onAction={() => navigate("/AttendeeDashboard/DiscoverEvents")}
            />
          ) : (
            <div className="flex flex-col gap-space-md">
              {visible.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  onView={setSelectedTicket}
                />
              ))}
            </div>
          )}

          <EventPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        </div>
      </section>

      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
        title="Digital Ticket"
      >
        {selectedTicket && <DigitalTicket ticket={selectedTicket} />}
      </Modal>
    </div>
  );
}
