import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../Components/ui/Logo";
import { sectionVariants } from "../utils/constantsVariants";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh w-full bg-background flex flex-col">
      <header className="h-20 px-gutter-mobile sm:px-gutter flex items-center border-b border-outline-variant">
        <Logo />
      </header>
      <motion.main
        className="flex-1 flex items-center justify-center px-gutter-mobile sm:px-gutter py-space-xl"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="max-w-lg w-full text-center flex flex-col items-center">
          <span className="text-label-sm uppercase tracking-widest text-muted-dark">
            Error 404 · Page not found
          </span>
          <h1 className="mt-space-sm text-display-hero-mobile md:text-display-hero text-primary-ink">
            This pass leads nowhere.
          </h1>
          <p className="mt-space-md text-body-md text-body-text">
            The page you are looking for has moved, ended, or never existed.
          </p>
          <div className="mt-space-xl flex flex-col sm:flex-row gap-space-sm w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center justify-center gap-space-xs border border-border-hairline text-primary-ink text-label-lg px-space-lg py-space-sm rounded-xl hover:bg-surface-container-low hover:border-muted-dark transition-colors"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
              Go Back
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="cursor-pointer inline-flex items-center justify-center gap-space-xs bg-primary-ink text-on-primary text-label-lg px-space-lg py-space-sm rounded-xl hover:bg-interactive-hover transition-colors"
            >
              <Compass size={18} strokeWidth={1.5} />
              Discover Events
            </button>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
