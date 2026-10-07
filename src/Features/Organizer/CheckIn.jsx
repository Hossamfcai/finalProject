import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  RotateCcw,
  ScanLine,
  ShieldX,
  XCircle,
} from "lucide-react";
import PageHeader from "../../Components/ui/common/PageHeader";
import StatusBadge from "../../Components/ui/common/StatusBadge";
import {
  checkInTicket,
  resetCheckIn,
  validateTicket,
} from "../../Store/Slices/ticketsSlice";
import { formatedDate, formatedDateTime } from "../../utils/formatedDate";

// Result tone per outcome (design system: success / warning / critical)
const TONES = {
  valid: {
    icon: CheckCircle2,
    box: "border-success/30 bg-success/5",
    iconBox: "bg-success/10 text-success",
  },
  used: {
    icon: Clock,
    box: "border-warning/30 bg-warning/5",
    iconBox: "bg-warning/10 text-warning",
  },
  invalid: {
    icon: XCircle,
    box: "border-error/30 bg-error-container/30",
    iconBox: "bg-error-container text-error",
  },
  forbidden: {
    icon: ShieldX,
    box: "border-error/30 bg-error-container/30",
    iconBox: "bg-error-container text-error",
  },
};

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-label-sm uppercase tracking-wider text-muted-dark">{label}</dt>
      <dd className="text-label-lg text-primary-ink break-words">{value ?? "—"}</dd>
    </div>
  );
}

export default function CheckIn() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [qrToken, setQrToken] = useState("");
  const {
    validation,
    validationLoading,
    validationError,
    checkInLoading,
    checkInError,
    checkedInTicket,
  } = useSelector((state) => state.tickets);

  useEffect(() => {
    inputRef.current?.focus();
    return () => dispatch(resetCheckIn());
  }, [dispatch]);

  const handleValidate = (event) => {
    event.preventDefault();
    const token = qrToken.trim();
    if (!token) return;
    dispatch(validateTicket(token));
  };

  const handleNext = () => {
    dispatch(resetCheckIn());
    setQrToken("");
    inputRef.current?.focus();
  };

  const ticket = validation?.ticket;

  // Derive which result card to show
  let outcome = null;
  if (validationError) {
    outcome = validationError.status === 403 ? "forbidden" : "invalid";
  } else if (checkedInTicket) {
    outcome = "checkedIn";
  } else if (validation) {
    if (validation.valid) outcome = "valid";
    else if (ticket?.status === "USED") outcome = "used";
    else outcome = "invalid";
  }

  const renderResult = () => {
    if (!outcome) return null;

    if (outcome === "forbidden" || (outcome === "invalid" && !ticket)) {
      const tone = TONES[outcome];
      const Icon = tone.icon;
      return (
        <div className={`rounded-3xl border p-space-lg flex items-start gap-space-md ${tone.box}`}>
          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tone.iconBox}`}>
            <Icon size={24} strokeWidth={1.5} />
          </span>
          <div>
            <h2 className="text-headline-sm text-primary-ink">
              {outcome === "forbidden" ? "Not your event" : "Invalid ticket"}
            </h2>
            <p className="text-body-sm text-body-text">
              {outcome === "forbidden"
                ? "This ticket belongs to an event you do not organize."
                : validationError?.message ?? "No ticket matches this QR code."}
            </p>
          </div>
        </div>
      );
    }

    const toneKey =
      outcome === "checkedIn" || outcome === "valid"
        ? "valid"
        : outcome === "used"
          ? "used"
          : "invalid";
    const tone = TONES[toneKey];
    const Icon = tone.icon;
    const titles = {
      valid: "Valid ticket",
      checkedIn: "Checked in",
      used: "Already checked in",
      invalid: "Ticket not valid",
    };
    const messages = {
      valid: "Verify the attendee, then confirm entry.",
      checkedIn: `Entry recorded at ${formatedDateTime(checkedInTicket?.checkedInAt)}.`,
      used: `This ticket was already used at ${formatedDateTime(ticket?.checkedInAt)}.`,
      invalid: validation?.reason ?? "This ticket can not be used for entry.",
    };

    return (
      <div className={`rounded-3xl border overflow-hidden ${tone.box}`}>
        <div className="p-space-lg flex items-start gap-space-md">
          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tone.iconBox}`}>
            <Icon size={24} strokeWidth={1.5} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-space-sm">
              <h2 className="text-headline-sm text-primary-ink">{titles[outcome]}</h2>
              <StatusBadge status={ticket?.status} />
            </div>
            <p className="text-body-sm text-body-text">{messages[outcome]}</p>
          </div>
        </div>
        <dl className="bg-surface-container-lowest border-t border-dashed border-muted-light p-space-lg grid grid-cols-1 sm:grid-cols-2 gap-space-md">
          <Detail label="Attendee" value={ticket?.user?.name} />
          <Detail label="Email" value={ticket?.user?.email} />
          <Detail label="Event" value={ticket?.event?.title} />
          <Detail label="Event date" value={ticket?.event?.date ? `${formatedDate(ticket.event.date)} · ${ticket.event.startTime}` : null} />
          <Detail label="Ticket type" value={ticket?.ticketType?.name} />
          <Detail label="Ticket code" value={ticket?.code} />
          <Detail
            label="Check-in status"
            value={ticket?.checkedInAt ? `Checked in ${formatedDateTime(ticket.checkedInAt)}` : "Not checked in"}
          />
        </dl>
        {checkInError && (
          <div className="px-space-lg py-space-sm bg-error-container/40 text-label-md text-error flex items-center gap-space-xs">
            <AlertTriangle size={16} /> {checkInError.message}
          </div>
        )}
        <div className="p-space-lg pt-0 bg-surface-container-lowest flex flex-col sm:flex-row gap-space-sm justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="cursor-pointer inline-flex justify-center items-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-lg py-2.5 rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
          >
            <RotateCcw size={16} strokeWidth={1.5} />
            Next ticket
          </button>
          {outcome === "valid" && (
            <button
              type="button"
              onClick={() => dispatch(checkInTicket(ticket.id))}
              disabled={checkInLoading}
              className="cursor-pointer inline-flex justify-center items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-lg py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors disabled:opacity-60"
            >
              {checkInLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} strokeWidth={1.5} />
              )}
              Confirm check-in
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/OrganizerDashboard" },
          { label: "Check-in" },
        ]}
        title="Ticket Check-in"
        description="Scan or enter the QR value of an attendee's ticket to validate entry."
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[860px] mx-auto flex flex-col gap-space-lg">
          <form
            onSubmit={handleValidate}
            className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-md"
          >
            <label
              htmlFor="qr-token"
              className="text-label-sm uppercase tracking-wider text-secondary-fill"
            >
              QR code value
            </label>
            <div className="flex flex-col sm:flex-row gap-space-sm">
              <div className="flex-1 flex items-center gap-space-xs px-space-md rounded-xl bg-surface-container-low border border-border-hairline focus-within:border-primary-ink focus-within:ring-1 focus-within:ring-primary-ink">
                <ScanLine size={18} strokeWidth={1.5} className="text-outline shrink-0" />
                <input
                  id="qr-token"
                  ref={inputRef}
                  type="text"
                  value={qrToken}
                  onChange={(event) => setQrToken(event.target.value)}
                  placeholder="Scan with a USB/Bluetooth scanner or paste the code"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-2.5 text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!qrToken.trim() || validationLoading}
                className="cursor-pointer inline-flex justify-center items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-lg py-2.5 rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {validationLoading && <Loader2 size={16} className="animate-spin" />}
                Validate
              </button>
            </div>
            <p className="text-body-sm text-muted-dark">
              Validation previews the ticket without admitting it. Entry is only recorded after you confirm.
            </p>
          </form>

          <AnimatePresence mode="wait">
            {outcome && (
              <motion.div
                key={`${outcome}-${ticket?.id ?? "none"}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                aria-live="polite"
              >
                {renderResult()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
