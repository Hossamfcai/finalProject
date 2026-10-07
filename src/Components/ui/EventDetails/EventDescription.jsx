import { useSelector } from "react-redux";
import { sectionVariants } from "../../../utils/constantsVariants";
import { motion } from "framer-motion";
export default function EventDescription() {
  const { specificEvent } = useSelector((state) => state.events);
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md"
    >
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
          About This Event
        </span>
        <span className="font-label-md text-label-md text-secondary">
          Overview
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
        Event Description
      </h2>
      <div className="text-on-surface-variant font-body-md text-body-md leading-relaxed">
        <p className="text-lg text-on-surface leading-relaxed">
          {specificEvent?.description}
        </p>
      </div>
    </motion.section>
  );
}
