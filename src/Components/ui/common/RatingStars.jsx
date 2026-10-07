import { useState } from "react";
import { Star } from "lucide-react";

// Read-only when onChange is not provided.
export default function RatingStars({ value = 0, onChange, size = 18 }) {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = hovered || value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Rating" : `${value} out of 5 stars`}
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(shown);
        const icon = (
          <Star
            size={size}
            strokeWidth={filled ? 2 : 1.5}
            className={filled ? "fill-primary-ink text-primary-ink" : "text-muted-mid"}
          />
        );
        return interactive ? (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
            className="cursor-pointer p-0.5 rounded-md hover:scale-110 transition-transform"
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}
    </div>
  );
}
