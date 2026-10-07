import { CalendarDays, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { sectionVariants } from "../../../utils/constantsVariants";
import { useSelector } from "react-redux";
import { formatedDate } from "../../../utils/formatedDate";
import defaultImage from "../../../assets/images/event_defaultImg.png";
export default function EventHeader() {
  let totalTickets = 0;
  const { specificEvent } = useSelector((state) => state.events);
  const formattedDate = formatedDate(specificEvent?.date);
  specificEvent?.ticketTypes?.forEach((ticket) => {
    totalTickets += ticket?.availableQuantity;
  });

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-lg"
    >
      {/* Status & Category */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider bg-surface-container-high text-on-surface font-semibold">
          {specificEvent?.category?.name}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider ${specificEvent?.status?.toLowerCase() == "upcoming" || totalTickets == 0 ? "bg-surface-container-high text-on-surface" : "bg-success/10 text-success"}  font-semibold`}
        >
          <span
            className={`w-2 h-2 rounded-full ${specificEvent?.status?.toLowerCase() == "upcoming" || totalTickets == 0 ? "bg-primary" : "bg-success"}`}
          />
          {specificEvent?.status?.toLowerCase() == "upcoming" &&
            specificEvent?.status}
          {specificEvent?.status?.toLowerCase() == "published" &&
            totalTickets !== 0 &&
            `${specificEvent?.status} • tickets available`}
          {specificEvent?.status?.toLowerCase() == "published" &&
            !totalTickets &&
            specificEvent?.ticketTypes?.length !== 0 &&
            "tickets • sold out"}
          {specificEvent?.status?.toLowerCase() == "published" &&
            specificEvent?.ticketTypes?.length === 0 &&
            "published • tickets coming soon"}
          {specificEvent?.status?.toLowerCase() == "canceled" &&
            "event cancelled"}
          {specificEvent?.status?.toLowerCase() == "archived" &&
            "event ended"}
        </span>
      </div>
      {/* Title */}
      <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero font-bold tracking-tight text-on-surface leading-[1.08]">
        {specificEvent?.title}
      </h1>
      {/* Event Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
        {/* Date */}
        <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-primary shadow-sm border border-outline-variant/20">
            <CalendarDays size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Date & Time
            </p>
            <p className="font-body-md text-body-md font-bold text-on-surface mt-0.5">
              {formattedDate}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {specificEvent?.startTime} – {specificEvent?.endTime}
            </p>
          </div>
        </div>
        {/* Venue */}
        <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-primary shadow-sm border border-outline-variant/20">
            <MapPin size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
              Venue
            </p>
            <p className="font-body-md text-body-md font-bold text-on-surface mt-0.5">
              {specificEvent?.venue}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {specificEvent?.address}
            </p>
          </div>
        </div>
      </div>
      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-surface-dim shadow-inner">
        <img
          src={specificEvent?.imageUrl ? specificEvent?.imageUrl : defaultImage}
          alt="Cairo Arts gathering exhibition featuring curated paintings and sculptures"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </motion.section>
  );
}
