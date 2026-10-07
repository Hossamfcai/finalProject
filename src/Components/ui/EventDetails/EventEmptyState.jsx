import { motion } from "framer-motion";
import { SearchX, RotateCcw } from "lucide-react";
export default function EventEmptyState({ search = "", onReset }) {
  const hasSearch = search.trim().length > 0;
  return (
    <motion.div
      className="w-full min-h-[360px] bg-surface-container-lowest rounded-2xl shadow-sm flex items-center justify-center px-space-lg py-space-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {" "}
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {" "}
        {/* Icon */}{" "}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline mb-space-md"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        >
          {" "}
          <SearchX size={30} strokeWidth={1.8} />{" "}
        </motion.div>{" "}
        {/* Heading */}{" "}
        <motion.h2
          className="font-headline-md text-headline-md text-on-surface font-semibold"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          {" "}
          {hasSearch ? "No events found" : "No events available"}{" "}
        </motion.h2>{" "}
        {/* Description */}{" "}
        <motion.p
          className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs max-w-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {" "}
          {hasSearch
            ? `We couldn't find any events matching "${search}". Try a different search or adjust your filters.`
            : "There are currently no events matching your selected filters. Try changing your filters to discover more events."}{" "}
        </motion.p>{" "}
        {/* Action */}{" "}
        {onReset && (
          <motion.button
            type="button"
            onClick={onReset}
            className="mt-space-lg inline-flex items-center gap-space-xs bg-primary text-on-primary font-label-md text-label-md font-semibold px-space-md py-space-sm rounded-xl shadow-sm hover:opacity-90 transition-opacity"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {" "}
            <RotateCcw size={17} /> <span>Reset Filters</span>{" "}
          </motion.button>
        )}{" "}
      </div>{" "}
    </motion.div>
  );
}
