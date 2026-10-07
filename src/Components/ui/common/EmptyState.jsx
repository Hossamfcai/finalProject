import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = "",
}) {
  return (
    <motion.div
      className={`w-full min-h-[320px] bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low flex items-center justify-center px-space-lg py-space-xl ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline mb-space-md">
          <Icon size={30} strokeWidth={1.5} />
        </div>
        <h2 className="text-headline-sm text-on-surface">{title}</h2>
        {description && (
          <p className="text-body-sm text-body-text mt-space-xs max-w-sm">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <motion.button
            type="button"
            onClick={onAction}
            className="cursor-pointer mt-space-lg inline-flex items-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-md py-space-sm rounded-xl hover:bg-interactive-hover active:bg-surface-deepest transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            {ActionIcon && <ActionIcon size={17} />}
            <span>{actionLabel}</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
