import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const sorted = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
};

const navBtn =
  "w-10 h-10 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none";

function EventPagination({ page, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      className="pt-space-xl pb-space-lg flex flex-col items-center gap-space-md border-t border-surface-container-high"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.35 }}
    >
      <div className="flex items-center gap-space-xs">
        <motion.button
          type="button"
          aria-label="Previous Page"
          disabled={disabled || page === 1}
          onClick={() => onPageChange(page - 1)}
          className={navBtn}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={20} />
        </motion.button>

        {getPageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="px-space-xs text-outline font-body-sm"
            >
              ...
            </span>
          ) : (
            <motion.button
              key={p}
              type="button"
              disabled={disabled}
              aria-current={p === page ? "page" : undefined}
              onClick={() => p !== page && onPageChange(p)}
              className={`w-10 h-10 rounded-lg font-label-lg text-label-lg transition-colors ${
                p === page
                  ? "bg-primary text-on-primary font-bold"
                  : "text-on-surface hover:bg-surface-container-low"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {p}
            </motion.button>
          ),
        )}

        <motion.button
          type="button"
          aria-label="Next Page"
          disabled={disabled || page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={navBtn}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default EventPagination;
