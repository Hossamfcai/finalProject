import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CalendarDays, Clock, Loader2, MapPin, RotateCcw } from "lucide-react";
import { getTicketQr } from "../../../Store/Slices/ticketsSlice";
import { formatedDate, formatedDateTime } from "../../../utils/formatedDate";
import StatusBadge from "../common/StatusBadge";
import eventverseLogo from "../../../assets/icons/eventverse-logo-black.svg";

// Ticket pass: event stub + detachable QR stub split by a dashed perforation.
export default function DigitalTicket({ ticket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { qrCodes, qrLoading, qrError } = useSelector((state) => state.tickets);
  const qrDataUrl = qrCodes[ticket.id];
  const isValid = ticket.status === "VALID";

  useEffect(() => {
    dispatch(getTicketQr(ticket.id));
  }, [dispatch, ticket.id]);

  return (
    <article className="w-full rounded-3xl overflow-hidden bg-surface-container-lowest border border-border-hairline shadow-hover">
      {/* Event stub */}
      <div className="bg-surface-deepest text-on-primary p-space-lg space-y-space-md">
        <div className="flex items-center justify-between gap-space-sm">
          <img src={eventverseLogo} alt="EventVerse" className="h-6 w-auto" />
          <span className="rounded-full bg-surface-container-lowest">
            <StatusBadge status={ticket.status} />
          </span>
        </div>
        <h3 className="text-headline-md break-words">{ticket.event?.title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-body-sm text-secondary-fixed">
          <span className="flex items-center gap-space-xs">
            <CalendarDays size={16} strokeWidth={1.5} />
            {formatedDate(ticket.event?.date)}
          </span>
          <span className="flex items-center gap-space-xs">
            <Clock size={16} strokeWidth={1.5} />
            {ticket.event?.startTime} – {ticket.event?.endTime}
          </span>
          <span className="flex items-start gap-space-xs sm:col-span-2">
            <MapPin size={16} strokeWidth={1.5} className="shrink-0 mt-0.5" />
            <span>
              {ticket.event?.venue}
              {ticket.event?.address && `, ${ticket.event.address}`}
            </span>
          </span>
        </div>
      </div>

      {/* Perforation with semicircular cutouts */}
      <div className="relative h-8 bg-surface-container-lowest">
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface-container-low border border-border-hairline" />
        <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface-container-low border border-border-hairline" />
        <span className="absolute left-4 right-4 top-1/2 border-t-2 border-dashed border-muted-light" />
      </div>

      {/* QR stub */}
      <div className="px-space-lg pb-space-lg grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-space-lg items-center">
        <dl className="grid grid-cols-2 gap-x-space-md gap-y-space-sm">
          <div className="col-span-2">
            <dt className="text-label-sm uppercase tracking-wider text-muted-dark">
              Attendee
            </dt>
            <dd className="text-label-lg text-primary-ink break-words">
              {user?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-label-sm uppercase tracking-wider text-muted-dark">
              Ticket
            </dt>
            <dd className="text-label-lg text-primary-ink">
              {ticket.ticketType?.name}
            </dd>
          </div>
          <div>
            <dt className="text-label-sm uppercase tracking-wider text-muted-dark">
              Code
            </dt>
            <dd className="text-label-lg text-primary-ink break-all">
              {ticket.code}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-label-sm uppercase tracking-wider text-muted-dark">
              Booking
            </dt>
            <dd className="text-label-md text-secondary-fill break-all">
              EV-{ticket.bookingId?.slice(-8).toUpperCase()}
            </dd>
          </div>
          {ticket.checkedInAt && (
            <div className="col-span-2">
              <dt className="text-label-sm uppercase tracking-wider text-muted-dark">
                Checked in
              </dt>
              <dd className="text-label-md text-warning">
                {formatedDateTime(ticket.checkedInAt)}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex flex-col items-center gap-space-xs">
          <div
            className={`w-44 h-44 rounded-2xl border border-border-hairline bg-surface-container-lowest flex items-center justify-center overflow-hidden ${isValid ? "" : "opacity-40 grayscale"}`}
          >
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for ticket ${ticket.code}`}
                className="w-full h-full object-contain p-2"
              />
            ) : qrLoading ? (
              <Loader2 size={28} className="animate-spin text-muted-mid" />
            ) : (
              <button
                type="button"
                onClick={() => dispatch(getTicketQr(ticket.id))}
                className="cursor-pointer flex flex-col items-center gap-1 text-label-md text-secondary-fill px-space-sm text-center"
              >
                <RotateCcw size={20} strokeWidth={1.5} />
                {qrError ?? "Load QR"}
              </button>
            )}
          </div>
          <span className="text-label-sm uppercase tracking-wider text-muted-dark">
            {isValid ? "Present at the gate" : "Not valid for entry"}
          </span>
          {isValid && ticket.qrToken && (
            <span
              className="max-w-44 text-center text-[10px] leading-tight text-muted-dark break-all select-all"
              title="Manual entry code"
            >
              {ticket.qrToken}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
