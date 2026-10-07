import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import EmptyState from "../../Components/ui/common/EmptyState";
import ErrorState from "../../Components/ui/common/ErrorState";
import StatusBadge from "../../Components/ui/common/StatusBadge";
import EventPagination from "../../Components/ui/EventDetails/EventPagination";
import {
  deleteEvent,
  getOrganizerEvents,
  updateEventStatus,
} from "../../Store/Slices/organizerSlice";
import { formatedDate } from "../../utils/formatedDate";
import {
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from "../../utils/sweetAlertNotifications";
import defaultImage from "../../assets/images/event_defaultImg.png";

const EVENTS_PER_PAGE = 10;

const ticketStats = (event) => {
  const total = (event.ticketTypes ?? []).reduce(
    (sum, ticketType) => sum + ticketType.totalQuantity,
    0,
  );
  const available = (event.ticketTypes ?? []).reduce(
    (sum, ticketType) => sum + ticketType.availableQuantity,
    0,
  );
  return { total, sold: total - available };
};

function IconAction({ label, icon: Icon, onClick, danger, loading, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      title={label}
      aria-label={label}
      className={`cursor-pointer w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${danger ? "text-error hover:bg-error-container/40" : "text-secondary-fill hover:bg-surface-container-low hover:text-primary-ink"}`}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Icon size={16} strokeWidth={1.5} />
      )}
    </button>
  );
}

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    events,
    pagination,
    eventsLoading,
    eventsError,
    deletingId,
    updatingStatusId,
  } = useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(getOrganizerEvents({ page: 1, limit: EVENTS_PER_PAGE }));
  }, [dispatch]);

  const reload = (page = pagination.page) =>
    dispatch(getOrganizerEvents({ page, limit: EVENTS_PER_PAGE }));

  const handleDelete = async (event) => {
    const { sold } = ticketStats(event);
    if (sold > 0) {
      // booked ticket types can not be removed on the server
      showErrorAlert(
        "Event has bookings",
        `"${event.title}" already has ${sold} ticket(s) sold, so it can not be deleted. Cancel the event instead.`,
      );
      return;
    }
    const confirmed = await showConfirmDialog({
      title: "Delete event?",
      message: `"${event.title}" and its ticket types will be permanently removed. This can not be undone.`,
      confirmText: "Delete",
      danger: true,
    });
    if (!confirmed) return;
    const result = await dispatch(
      deleteEvent({
        eventId: event.id,
        ticketTypeIds: (event.ticketTypes ?? []).map((ticketType) => ticketType.id),
      }),
    );
    if (deleteEvent.fulfilled.match(result)) {
      showSuccessAlert("Event deleted", `"${event.title}" was removed.`);
      // keep the page filled after a removal
      reload(events.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page);
    } else {
      showErrorAlert("Can not delete event", result.payload?.message);
    }
  };

  const handleStatus = async (event, status) => {
    const isCancel = status === "CANCELED";
    const confirmed = await showConfirmDialog({
      title: isCancel ? "Cancel event?" : "Publish event?",
      message: isCancel
        ? `Bookings for "${event.title}" will close and attendees will see it as cancelled.`
        : `"${event.title}" will open for ticket bookings.`,
      confirmText: isCancel ? "Cancel Event" : "Publish",
      cancelText: "Back",
      danger: isCancel,
    });
    if (!confirmed) return;
    const result = await dispatch(updateEventStatus({ eventId: event.id, status }));
    if (updateEventStatus.rejected.match(result)) {
      showErrorAlert("Status not updated", result.payload?.message);
    }
  };

  const renderActions = (event) => {
    const canPublish = event.status === "UPCOMING";
    const canCancel = event.status === "UPCOMING" || event.status === "PUBLISHED";
    return (
      <div className="flex flex-wrap items-center justify-end gap-0.5">
        <IconAction
          label="View public page"
          icon={Eye}
          onClick={() => navigate(`/Eventdetails/${event.id}`)}
        />
        <IconAction
          label="Edit event & tickets"
          icon={Pencil}
          onClick={() => navigate(`/OrganizerDashboard/Events/${event.id}/Edit`)}
        />
        <IconAction
          label="View bookings"
          icon={Users}
          onClick={() => navigate(`/OrganizerDashboard/Events/${event.id}/Bookings`)}
        />
        <IconAction
          label="View analytics"
          icon={BarChart3}
          onClick={() => navigate(`/OrganizerDashboard/Events/${event.id}/Analytics`)}
        />
        {canPublish && (
          <IconAction
            label="Publish"
            icon={Send}
            loading={updatingStatusId === event.id}
            onClick={() => handleStatus(event, "PUBLISHED")}
          />
        )}
        {canCancel && (
          <button
            type="button"
            onClick={() => handleStatus(event, "CANCELED")}
            disabled={updatingStatusId === event.id}
            className="cursor-pointer px-space-sm h-9 rounded-xl text-label-md text-warning hover:bg-warning/10 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
        )}
        <IconAction
          label="Delete"
          icon={Trash2}
          danger
          loading={deletingId === event.id}
          onClick={() => handleDelete(event)}
        />
      </div>
    );
  };

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "My Events" },
        ]}
        title="My Events"
        description={`${pagination.total} event${pagination.total === 1 ? "" : "s"} you organize`}
        actions={
          <button
            type="button"
            onClick={() => navigate("/OrganizerDashboard/AddEvent")}
            className="cursor-pointer inline-flex items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-md py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors"
          >
            <Plus size={16} />
            Create Event
          </button>
        }
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {eventsLoading && events.length === 0 ? (
            <div className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-space-lg space-y-space-md animate-pulse">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-14 rounded-lg bg-surface-container-high" />
              ))}
            </div>
          ) : eventsError ? (
            <ErrorState message={eventsError} onRetry={() => reload()} />
          ) : events.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events yet"
              description="Create your first event, add ticket types and publish it to start selling."
              actionLabel="Create Event"
              actionIcon={Plus}
              onAction={() => navigate("/OrganizerDashboard/AddEvent")}
            />
          ) : (
            <>
              {/* Desktop table */}
              <div
                className={`hidden lg:block bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low overflow-x-auto transition-opacity ${eventsLoading ? "opacity-60" : ""}`}
              >
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-hairline text-label-sm uppercase tracking-wider text-muted-dark">
                      <th className="px-space-lg py-space-md font-bold">Event</th>
                      <th className="px-space-md py-space-md font-bold">Category</th>
                      <th className="px-space-md py-space-md font-bold">Status</th>
                      <th className="px-space-md py-space-md font-bold">Tickets sold</th>
                      <th className="px-space-lg py-space-md font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {events.map((event) => {
                      const { total, sold } = ticketStats(event);
                      const percent = total ? Math.round((sold / total) * 100) : 0;
                      return (
                        <tr
                          key={event.id}
                          className="text-body-sm text-body-text hover:bg-surface-container-low/60 transition-colors"
                        >
                          <td className="px-space-lg py-space-md">
                            <div className="flex items-center gap-space-sm min-w-0">
                              <img
                                src={event.imageUrl || defaultImage}
                                alt=""
                                className="w-14 h-10 rounded-lg object-cover bg-surface-container shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="block text-label-lg text-primary-ink truncate max-w-xs">
                                  {event.title}
                                </span>
                                <span className="text-label-md text-muted-dark">
                                  {formatedDate(event.date)} · {event.startTime}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-space-md py-space-md">
                            {event.category?.name}
                          </td>
                          <td className="px-space-md py-space-md">
                            <StatusBadge status={event.status} />
                          </td>
                          <td className="px-space-md py-space-md min-w-36">
                            <span className="text-label-lg text-primary-ink">
                              {sold}
                            </span>
                            <span className="text-muted-dark"> / {total}</span>
                            <div className="mt-1 h-1.5 w-28 rounded-full bg-surface-container-high overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary-ink"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-space-lg py-space-md">
                            {renderActions(event)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet cards */}
              <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {events.map((event) => {
                  const { total, sold } = ticketStats(event);
                  return (
                    <article
                      key={event.id}
                      className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[16/7] bg-surface-container">
                        <img
                          src={event.imageUrl || defaultImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-space-sm left-space-sm rounded-full bg-surface-container-lowest">
                          <StatusBadge status={event.status} />
                        </span>
                      </div>
                      <div className="p-space-md space-y-1 flex-1">
                        <span className="text-label-sm uppercase tracking-wider text-muted-dark">
                          {event.category?.name} · {formatedDate(event.date)}
                        </span>
                        <h3 className="text-label-lg text-primary-ink break-words">
                          {event.title}
                        </h3>
                        <p className="text-body-sm text-body-text">
                          {sold} / {total} tickets sold
                        </p>
                      </div>
                      <div className="border-t border-border-hairline px-space-sm py-space-xs">
                        {renderActions(event)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          <EventPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => reload(page)}
            disabled={eventsLoading}
          />
        </div>
      </section>
    </div>
  );
}
