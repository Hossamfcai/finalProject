import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { sectionVariantsEaseOut } from "../../../utils/constantsVariants";

// Title strip used at the top of dashboard pages (mirrors the Discover Events header).
export default function PageHeader({ breadcrumbs = [], title, description, actions }) {
  return (
    <motion.section
      className="w-full bg-surface-container-low py-space-lg px-gutter-mobile sm:px-gutter border-b border-surface-container-high"
      initial="hidden"
      animate="visible"
      variants={sectionVariantsEaseOut}
    >
      <div className="max-w-[1360px] mx-auto flex flex-col gap-space-md">
        {breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-space-xs text-label-md text-on-surface-variant">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-space-xs">
                {index > 0 && <span className="text-outline"> / </span>}
                {crumb.to ? (
                  <Link to={crumb.to} className="hover:text-on-surface transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-on-surface font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-space-md">
          <div className="min-w-0">
            <h1 className="text-headline-xl-mobile md:text-headline-lg text-on-surface tracking-tight break-words">
              {title}
            </h1>
            {description && (
              <p className="text-body-sm text-on-surface-variant mt-0.5">{description}</p>
            )}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-space-sm">{actions}</div>}
        </div>
      </div>
    </motion.section>
  );
}
