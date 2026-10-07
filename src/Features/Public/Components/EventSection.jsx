import { sectionVariants } from "../../../utils/constantsVariants";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventCard from "../../../Components/ui/EventDetails/EventCard";
import { useSelector } from "react-redux";
import EventCardSkeleton from "../../../Components/ui/EventDetails/EventCardSkeleton";
export default function EventsSection({
  text,
  icon,
  headText,
  paragraph,
  sectionName,
}) {
  const navigate = useNavigate();

  const { loading, events } = useSelector((state) => state.events);
  const published = events.filter((eventItem) => {
    return eventItem.status.toLowerCase() === "published";
  });
  const upcoming = events.filter((eventItem) => {
    return eventItem.status.toLowerCase() === "upcoming";
  });

  return (
    <motion.section
      className="w-full py-space-xl bg-surface-container-lowest"
      id={sectionName}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="max-w-[1360px] mx-auto px-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-space-lg gap-space-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
              {icon}
              {text}
            </span>
            <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight mt-2">
              {headText}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {paragraph}
            </p>
          </div>
          <a
            className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-primary hover:text-secondary transition-colors group"
            data-path="discover-events"
            onClick={() => {
              navigate("/Authentication/Login");
            }}
          >
            {sectionName == "published" && (
              <span>{`View all ${published.length} events`}</span>
            )}
            {sectionName == "upcoming" && (
              <span>{`View all ${upcoming.length} events`}</span>
            )}
            <ArrowRight
              className="text-[18px] group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {sectionName == "published" &&
            (loading
              ? Array.from({ length: 3 }).map((_, i) => {
                  return <EventCardSkeleton key={i} />;
                })
              : published.map((eventItem, i) => {
                  if (i <= 2) {
                    return <EventCard data={eventItem} key={eventItem.id} />;
                  }
                }))}
          {sectionName == "upcoming" &&
            (loading
              ? Array.from({ length: 3 }).map((_, i) => {
                  return <EventCardSkeleton key={i} />;
                })
              : upcoming.map((eventItem, i) => {
                  if (i <= 2) {
                    return <EventCard data={eventItem} key={eventItem.id} />;
                  }
                }))}
        </div>
      </div>
    </motion.section>
  );
}
