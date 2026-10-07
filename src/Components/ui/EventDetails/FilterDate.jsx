import { motion } from "framer-motion";
import { getTodayDate } from "../../../utils/formatedDate";
export default function FilterDate({ selectedDate, handleSelectedDate }) {
  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm font-semibold text-on-surface">
          Date
        </span>

        {selectedDate && (
          <motion.button
            type="button"
            onClick={() => handleSelectedDate("")}
            className="font-label-sm text-label-sm text-secondary hover:text-on-surface underline transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        )}
      </div>

      <input
        type="date"
        value={selectedDate}
        min={getTodayDate()}
        onChange={(event) => handleSelectedDate(event.target.value)}
        className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-space-sm py-2 rounded-lg border border-transparent focus:border-primary focus:outline-none focus:ring-0 cursor-pointer"
      />
    </div>
  );
}
