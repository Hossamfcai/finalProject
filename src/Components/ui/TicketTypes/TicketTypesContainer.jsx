import TicketCard from "../../../Components/ui/TicketTypes/TicketCard";
import TotalPrice from "../../../Components/ui/TicketTypes/TotalPrice";
import { Ticket, Lock, QrCode, Loader2, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sectionVariants } from "../../../utils/constantsVariants";
import { createBooking } from "../../../Store/Slices/bookingsSlice";
import { getEventBookingBlock } from "../../../utils/bookingRules";
import { formatCurrency } from "../../../utils/formatedDate";
import {
  showConfirmDialog,
  showErrorAlert,
  showSuccessAlert,
} from "../../../utils/sweetAlertNotifications";
// event / ticket names are user content -> escape before injecting into Swal html
const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

export default function TicketTypesContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { specificEvent } = useSelector((state) => state.events);
  const { createLoading } = useSelector((state) => state.bookings);
  // one ticket type per booking (backend: { eventId, ticketTypeId, quantity })
  const [selection, setSelection] = useState({ ticketTypeId: null, quantity: 0 });

  const isAttendee = user?.role?.toLowerCase() === "user";
  const bookingBlock = getEventBookingBlock(specificEvent);
  const canSelect = isAuthenticated && isAttendee && !bookingBlock;
  const selectedTicket = specificEvent?.ticketTypes?.find(
    (ticket) => ticket.id === selection.ticketTypeId,
  );
  const hasSelection = Boolean(selectedTicket) && selection.quantity > 0;

  const handleQuantityChange = (ticketTypeId, quantity) => {
    setSelection(
      quantity > 0 ? { ticketTypeId, quantity } : { ticketTypeId: null, quantity: 0 },
    );
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate("/Authentication/Login");
      return;
    }
    if (!hasSelection) return;

    const total = selectedTicket.price * selection.quantity;
    const confirmed = await showConfirmDialog({
      title: "Confirm Booking",
      html: `
        <div style="text-align:left;font-size:14px;line-height:22px">
          <p style="font-weight:600;color:#1c1917;margin-bottom:8px">${escapeHtml(specificEvent.title)}</p>
          <div style="display:flex;justify-content:space-between"><span>${escapeHtml(selectedTicket.name)} ${formatCurrency(selectedTicket.price)} × ${selection.quantity}</span><span>${formatCurrency(total)}</span></div>
          <div style="display:flex;justify-content:space-between;border-top:1px solid #e7e5e4;margin-top:8px;padding-top:8px;font-weight:700;color:#1c1917"><span>Total</span><span>${formatCurrency(total)}</span></div>
        </div>`,
      confirmText: "Confirm Booking",
    });
    if (!confirmed) return;

    const result = await dispatch(
      createBooking({
        eventId: specificEvent.id,
        ticketTypeId: selectedTicket.id,
        quantity: selection.quantity,
      }),
    );
    if (createBooking.fulfilled.match(result)) {
      setSelection({ ticketTypeId: null, quantity: 0 });
      showSuccessAlert(
        "Booking confirmed",
        `${result.payload.tickets.length} digital ticket(s) issued.`,
      );
      navigate("/AttendeeDashboard/Tickets");
    } else {
      showErrorAlert("Booking failed", result.payload?.message);
    }
  };

  let buttonLabel = "Select Tickets to Continue";
  if (!isAuthenticated) buttonLabel = "Sign In to Book";
  else if (!isAttendee) buttonLabel = "Attendee accounts only";
  else if (bookingBlock) buttonLabel = bookingBlock.title;
  else if (hasSelection) buttonLabel = `Book ${selection.quantity} Ticket${selection.quantity > 1 ? "s" : ""}`;

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className="lg:col-span-4 lg:sticky lg:top-28"
    >
      <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl space-y-space-md">
        {/* Ticket Header */}
        <div className="flex items-center justify-between pb-space-sm bg-surface-container-lowest">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Select Tickets
            </h3>
            <p className="font-body-sm text-body-sm text-secondary">
              All venue fees & municipal VAT included
            </p>
          </div>
          <Ticket size={22} className="text-secondary" aria-hidden="true" />
        </div>
        {/* booking blocked (cancelled / ended / not on sale / sold out) */}
        {bookingBlock && (
          <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-border-hairline">
            <Info size={18} strokeWidth={1.5} className="text-secondary-fill shrink-0 mt-0.5" />
            <div>
              <p className="text-label-lg text-primary-ink">{bookingBlock.title}</p>
              <p className="text-body-sm text-body-text">{bookingBlock.message}</p>
            </div>
          </div>
        )}
        {/*  TICKETS  */}
        {specificEvent?.ticketTypes?.map((ticket) => {
          return (
            <TicketCard
              ticket={ticket}
              key={ticket.id}
              canSelect={canSelect}
              quantity={
                selection.ticketTypeId === ticket.id ? selection.quantity : 0
              }
              onQuantityChange={(quantity) =>
                handleQuantityChange(ticket.id, quantity)
              }
            />
          );
        })}
        {canSelect && specificEvent?.ticketTypes?.length > 1 && (
          <p className="text-label-md text-muted-dark">
            One ticket type per booking. Max 20 tickets.
          </p>
        )}
        {/*  PRICE BREAKDOWN  */}
        <TotalPrice ticket={selectedTicket} quantity={selection.quantity} />
        {/*  ACTIONS  */}

        <button
          type="button"
          onClick={handleBooking}
          className="cursor-pointer w-full py-4 px-6 rounded-xl bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-inverse-surface active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            isAuthenticated &&
            (!isAttendee || Boolean(bookingBlock) || !hasSelection || createLoading)
          }
        >
          {createLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              <span>Booking…</span>
            </>
          ) : (
            <span>{buttonLabel}</span>
          )}
          {!isAuthenticated && <Lock size={20} aria-hidden="true" />}
        </button>

        {/*  TRUST BADGES  */}
        <div className="pt-space-sm space-y-2 text-label-sm text-secondary">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-[#15803D]" aria-hidden="true" />
            <span>Rapid QR Gate Admission & NFC terminal entry</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
