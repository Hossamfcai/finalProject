import { motion } from "framer-motion";
import { cardVariants } from "../../../utils/constantsVariants";

export default function StatCard({ icon: Icon, label, value, hint, loading }) {
  return (
    <motion.div
      className="bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low p-space-lg flex flex-col gap-space-sm hover:shadow-hover transition-shadow"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="flex items-center justify-between">
        <span className="text-label-sm uppercase tracking-wider text-muted-dark">
          {label}
        </span>
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-ink">
            <Icon size={18} strokeWidth={1.5} />
          </span>
        )}
      </div>
      {loading ? (
        <div className="h-9 w-24 rounded-lg bg-surface-container-high animate-pulse" />
      ) : (
        <span className="text-headline-lg text-primary-ink tracking-tight">
          {value}
        </span>
      )}
      {hint && <span className="text-body-sm text-body-text">{hint}</span>}
    </motion.div>
  );
}
