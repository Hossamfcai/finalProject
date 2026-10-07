import { Minus, Plus } from "lucide-react";
import {
  getTicketUnavailableReason,
  MAX_TICKETS_PER_BOOKING,
} from "../../../utils/bookingRules";

export default function TicketCard({
  ticket,
  quantity = 0,
  onQuantityChange,
  canSelect,
}) {
  const unavailableReason = getTicketUnavailableReason(ticket);
  const isAvailable = !unavailableReason;
  const maxQuantity = Math.min(
    ticket?.availableQuantity ?? 0,
    MAX_TICKETS_PER_BOOKING,
  );
  const isSelected = quantity > 0;

  return (
    <div className="space-y-space-sm">
      <div
        className={`p-space-md rounded-xl transition-all border ${isSelected ? "border-primary-ink bg-surface-container-lowest" : "border-outline-variant/30"} ${isAvailable ? "bg-surface-container-lowest" : "opacity-60 bg-surface-container-low cursor-not-allowed"}`}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-0.5 pr-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-label-lg font-bold text-on-surface ${isAvailable ? "text-on-surface" : "text-secondary line-through"}`}
              >
                {ticket?.name}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-semibold  ${isAvailable ? (ticket.availableQuantity <= 10 ? "bg-warning/10 text-warning" : "bg-success/10 text-success") : "bg-surface-container-high text-on-surface"}`}
              >
                {isAvailable
                  ? ticket.availableQuantity <= 10
                    ? ` Only ${ticket.availableQuantity} left`
                    : ` Available . ${ticket?.availableQuantity} tickets`
                  : unavailableReason}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span
              className={`font-headline-sm text-headline-sm font-bold  ${isAvailable ? "text-on-surface" : "text-secondary line-through"}`}
            >
              {ticket?.price === 0 ? "Free" : `$${ticket?.price}`}
            </span>
          </div>
        </div>
        {/* Quantity */}
        {canSelect && (
          <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-outline-variant/20">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Quantity:
            </span>
            <div className="flex items-center gap-3 bg-surface-container px-3 py-1 rounded-full">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => onQuantityChange(quantity - 1)}
                className="cursor-pointer w-7 h-7 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center font-bold text-on-surface transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed "
                disabled={!isAvailable || quantity <= 0}
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <span
                className="font-label-lg font-bold text-on-surface w-6 text-center"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => onQuantityChange(quantity + 1)}
                disabled={!isAvailable || quantity >= maxQuantity}
                className="cursor-pointer w-7 h-7 rounded-full bg-surface-container-lowest hover:bg-surface-container-high flex items-center justify-center font-bold text-on-surface transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
