import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../Components/ui/common/PageHeader";
import EventForm from "./Components/EventForm";
import {
  clearSaveError,
  getOrganizerEvents,
  saveEvent,
} from "../../Store/Slices/organizerSlice";
import {
  createEventDefaults,
  toEventPayload,
  toTicketTypePayload,
} from "./eventFormUtils";
import { showSuccessAlert } from "../../utils/sweetAlertNotifications";

export default function AddEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveLoading, saveError } = useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(clearSaveError());
  }, [dispatch]);

  const handleSubmit = async (values) => {
    const result = await dispatch(
      saveEvent({
        eventData: toEventPayload(values),
        ticketTypes: values.ticketTypes.map(toTicketTypePayload),
      }),
    );
    if (saveEvent.fulfilled.match(result)) {
      dispatch(getOrganizerEvents({ page: 1, limit: 10 }));
      showSuccessAlert("Event created", `"${result.payload.title}" is ready.`);
      navigate("/OrganizerDashboard/Events");
    } else if (result.payload?.eventId) {
      // event exists but a ticket type failed -> continue in edit mode
      dispatch(getOrganizerEvents({ page: 1, limit: 10 }));
      navigate(`/OrganizerDashboard/Events/${result.payload.eventId}/Edit`);
    }
  };

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "My Events", to: "/OrganizerDashboard/Events" },
          { label: "Create Event" },
        ]}
        title="Create Event"
        description="Publish a new experience with its ticket types."
      />
      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1100px] mx-auto">
          <EventForm
            defaultValues={createEventDefaults}
            onSubmit={handleSubmit}
            submitting={saveLoading}
            serverError={saveError}
            onCancel={() => navigate("/OrganizerDashboard/Events")}
          />
        </div>
      </section>
    </div>
  );
}
