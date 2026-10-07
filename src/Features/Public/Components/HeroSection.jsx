import { motion } from "framer-motion";
import { ArrowDown, CirclePlus } from "lucide-react";
import heroPhoto from "../../../assets/images/HeroPhoto.jpeg";
import { sectionVariants } from "../../../utils/constantsVariants";
import { useNavigate } from "react-router-dom";
export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <motion.section
      className="relative w-full -mt-20 overflow-hidden bg-primary-container text-on-primary"
      id="home"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <img
        className="absolute inset-0 w-full  transition-transform duration-1000 ease-out"
        data-alt="Vibrant wide-angle capture of a packed contemporary concert arena bathed in volumetric warm amber and deep indigo stage lights. Silhouetted crowd with raised hands facing an architectural luminous stage design, subtle atmospheric haze, refined high-fashion photography mood, warm stone deep shadows."
        src={heroPhoto}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-primary/30 to-primary pointer-events-none"></div>

      <div className="relative max-w-[1360px] mx-auto px-gutter pt-36 pb-20 lg:pt-44 lg:pb-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-space-xs bg-surface-container-lowest/10 backdrop-blur-md px-space-md py-1 rounded-full mb-space-md">
          <span className="w-2 h-2 rounded-full bg-surface-bright animate-ping"></span>
          <span className="font-label-sm text-label-sm text-surface-bright tracking-widest uppercase">
            The Global Cultural Calendar
          </span>
        </div>

        <h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-on-primary tracking-tight max-w-4xl mx-auto">
          Discover Events That Move You
        </h1>

        <p className="mt-space-md font-body-xl text-body-xl text-secondary-fixed max-w-2xl mx-auto leading-relaxed">
          Curated live music, creative summits, intimate culinary experiences,
          and world-class conferences across 50+ global cultural hubs.
        </p>

        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md">
          <a
            className="font-label-lg text-label-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high px-7 py-3.5 rounded-xl transition-all shadow-xl hover:-translate-y-0.5 flex items-center gap-space-xs"
            href="#published"
          >
            <span>Explore Events</span>
            <ArrowDown className="text-[18px]" aria-hidden="true" />
          </a>
          <a
            className="cursor-pointer font-label-lg text-label-lg bg-surface-container-lowest/10 backdrop-blur-sm text-on-primary hover:bg-surface-container-lowest/20 px-7 py-3.5 rounded-xl transition-all flex items-center gap-space-xs"
            data-path="become-an-organizer"
            onClick={() => {
              navigate("/Authentication/Resgistration");
            }}
          >
            <span>Become an Organizer</span>
            <CirclePlus className="text-[18px]" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-space-lg flex flex-wrap items-center justify-center gap-y-2 gap-x-space-md font-body-sm text-body-sm text-surface-dim/80">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-bright"></span>
            10,000+ live curated events
          </span>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-bright"></span>
            500+ verified cultural organizers
          </span>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-bright"></span>
            50+ global capitals
          </span>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-bright"></span>
            4.9/5 verified attendee index
          </span>
        </div>
      </div>
    </motion.section>
  );
}
