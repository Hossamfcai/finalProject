import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong.",
  message,
  onRetry,
  className = "",
}) {
  return (
    <motion.div
      role="alert"
      className={`w-full min-h-[280px] bg-surface-container-lowest border border-border-hairline rounded-2xl shadow-low flex items-center justify-center px-space-lg py-space-xl ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="max-w-md w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-error-container flex items-center justify-center text-error mb-space-md">
          <AlertTriangle size={28} strokeWidth={1.5} />
        </div>
        <h2 className="text-headline-sm text-on-surface">{title}</h2>
        {message && (
          <p className="text-body-sm text-body-text mt-space-xs">{message}</p>
        )}
        {onRetry && (
          <motion.button
            type="button"
            onClick={onRetry}
            className="cursor-pointer mt-space-lg inline-flex items-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-md py-space-sm rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={17} />
            <span>Try Again</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
