import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SearchX } from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import ErrorState from "../../Components/ui/common/ErrorState";
import EmptyState from "../../Components/ui/common/EmptyState";
import EventForm from "./Components/EventForm";
import {
  clearSaveError,
  getOrganizerEvent,
  saveEvent,
} from "../../Store/Slices/organizerSlice";
import {
  diffTicketTypes,
  eventToFormValues,
  toEventPayload,
} from "./eventFormUtils";
import { showSuccessAlert } from "../../utils/sweetAlertNotifications";

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-space-lg animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-surface-container-lowest border border-border-hairline rounded-2xl p-space-xl space-y-space-md"
        >
          <div className="h-6 w-48 rounded bg-surface-container-high" />
          <div className="h-11 w-full rounded-xl bg-surface-container-high" />
          <div className="h-11 w-full rounded-xl bg-surface-container-high" />
        </div>
      ))}
    </div>
  );
}

export default function EditEvent() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    currentEvent,
    currentEventLoading,
    currentEventError,
    saveLoading,
    saveError,
  } = useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(clearSaveError());
    dispatch(getOrganizerEvent(id));
  }, [dispatch, id]);

  const isCurrent = currentEvent?.id === id;
  const defaultValues = useMemo(
    () => (isCurrent ? eventToFormValues(currentEvent) : null),
    [isCurrent, currentEvent],
  );

  const handleSubmit = async (values, originalValues) => {
    const { ticketTypes, removedTicketTypeIds } = diffTicketTypes(
      values.ticketTypes,
      originalValues.ticketTypes,
    );
    const eventData = toEventPayload(values);
    // ARCHIVED is shown as a settable status in the form; don't un-archive silently
    if (
      currentEvent.status === "ARCHIVED" &&
      values.status === originalValues.status
    ) {
      delete eventData.status;
    }
    const result = await dispatch(
      saveEvent({
        eventId: id,
        eventData,
        ticketTypes,
        removedTicketTypeIds,
      }),
    );
    // refresh either way so the form reflects what was actually saved
    dispatch(getOrganizerEvent(id));
    if (saveEvent.fulfilled.match(result)) {
      showSuccessAlert("Changes saved", `"${result.payload.title}" was updated.`);
      navigate("/OrganizerDashboard/Events");
    }
  };

  const renderBody = () => {
    if (currentEventError) {
      const status = currentEventError.status;
      return status === 403 || status === 404 ? (
        <EmptyState
          icon={SearchX}
          title={status === 403 ? "Not your event" : "Event not found"}
          description={currentEventError.message}
          actionLabel="Back to My Events"
          onAction={() => navigate("/OrganizerDashboard/Events")}
        />
      ) : (
        <ErrorState
          message={currentEventError.message}
          onRetry={() => dispatch(getOrganizerEvent(id))}
        />
      );
    }
    if (!defaultValues || (currentEventLoading && !isCurrent)) {
      return <FormSkeleton />;
    }
    return (
      <EventForm
        isEdit
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitting={saveLoading}
        serverError={saveError}
        onCancel={() => navigate("/OrganizerDashboard/Events")}
      />
    );
  };

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "My Events", to: "/OrganizerDashboard/Events" },
          { label: "Edit Event" },
        ]}
        title={isCurrent ? `Edit: ${currentEvent.title}` : "Edit Event"}
        description="Update details, tickets and publishing status."
      />
      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1100px] mx-auto">{renderBody()}</div>
      </section>
    </div>
  );
}
