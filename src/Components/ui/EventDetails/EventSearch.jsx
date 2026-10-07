import { motion } from "framer-motion";
import { Search, RefreshCw, ArrowRight } from "lucide-react";
export default function EventSearch({
  search,
  handleSearch,
  handleFilters,
  handleResetFilters,
}) {
  return (
    <motion.div
      className="bg-surface-container-lowest p-space-xs rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center gap-space-xs"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
    >
      {/* Search */}
      <div className="flex-1 flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
        <Search size={22} className="text-outline shrink-0" />
        <input
          id="event-search-input"
          type="text"
          value={search}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search exhibitions, concerts, talks..."
          className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
        />
      </div>
      {/* Actions */}
      <div className="flex items-center gap-space-xs pl-space-xs">
        {/* Reset */}
        <motion.button
          type="button"
          title="Clear Filters"
          onClick={handleResetFilters}
          className="p-space-xs rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.04 }}
        >
          <RefreshCw size={20} />
        </motion.button>
        {/* Find Tickets */}
        <motion.button
          type="button"
          className="disabled:bg-surface-container-low disabled:text-on-surface-variant bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-primary-container transition-colors flex items-center gap-space-xs whitespace-nowrap"
          whileHover={{ x: 2 }}
          disabled={search == ""}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            handleFilters();
          }}
        >
          <span> Find Events </span> <ArrowRight size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
}
