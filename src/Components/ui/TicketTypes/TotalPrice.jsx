import { formatCurrency } from "../../../utils/formatedDate";

export default function TotalPrice({ ticket, quantity = 0 }) {
  const total = ticket ? ticket.price * quantity : 0;
  return (
    <div className="pt-space-md space-y-space-xs bg-surface-container-low p-space-md rounded-xl text-body-sm font-body-sm">
      <div className="space-y-space-xs divide-y divide-outline-variant/30">
        {ticket && quantity > 0 ? (
          <div className="py-1 flex items-center justify-between text-on-surface-variant">
            <span>
              {ticket.name}{" "}
              <span className="text-secondary">
                {formatCurrency(ticket.price)} × {quantity}
              </span>
            </span>
            <span className="font-semibold text-on-surface">
              {formatCurrency(total)}
            </span>
          </div>
        ) : (
          <div className="py-1 text-secondary text-body-sm italic text-center">
            No tickets selected yet. Choose your quantity above.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-outline-variant/40 text-on-surface font-headline-sm text-headline-sm font-bold">
        <div>
          <span>Total Due</span>
          <span className="block text-label-sm font-normal text-secondary">
            {quantity} ticket{quantity === 1 ? "" : "s"} selected
          </span>
        </div>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
