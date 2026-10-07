import {
  Verified,
  Building2,
  AudioLines,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { motion } from "framer-motion";
import secondImage from "../../../assets/images/secondPhoto_About.png";
import firstImage from "../../../assets/images/firstPhoto_About.png";
import { sectionVariants } from "../../../utils/constantsVariants";
export default function About() {
  return (
    <motion.section
      className="w-full py-28 bg-surface-container-lowest border-t border-outline-variant/30 overflow-hidden"
      id="aboutus"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="max-w-[1360px] mx-auto px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
          {/* Images */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-space-md items-start">
              {/* Left Column */}
              <div className="space-y-space-md">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 aspect-[4/5] bg-surface-container">
                  <img
                    alt="An elegant, high-end architectural photo of an art gallery interior with warm minimalist stone walls, contemporary art sculptures, and natural light streaming through skylights"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    src={firstImage}
                  />
                </div>

                <div className="bg-background border border-outline-variant/30 rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-space-xs text-primary mb-1">
                    <Landmark size={20} strokeWidth={1.5} />
                    <span className="font-label-sm uppercase tracking-wider font-semibold">
                      Spatial Curation
                    </span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Hand-selected brutalist & contemporary halls.
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-space-md mt-12">
                <div className="bg-background border border-outline-variant/30 rounded-xl p-space-md shadow-sm">
                  <div className="flex items-center gap-space-xs text-primary mb-1">
                    <Verified size={20} strokeWidth={1.5} />

                    <span className="font-label-sm uppercase tracking-wider font-semibold">
                      Top 2% Globally
                    </span>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Strict resonance and spatial criteria standard.
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant/30 aspect-[4/5] bg-surface-container">
                  <img
                    alt="Sophisticated patrons and cultural attendees mingling in a stunning modern brutalist pavilion foyer with warm amber ambient lighting and textured stone architecture"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    src={secondImage}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-6 space-y-space-lg">
            {/* Heading */}
            <div className="space-y-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                <Verified size={14} strokeWidth={1.5} />
                ABOUT EVENTVERSE
              </span>

              <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight font-bold">
                Where Architectural Craft Meets Cultural Gathering
              </h2>
            </div>

            {/* Description */}
            <p className="font-body-xl text-body-xl text-on-surface-variant leading-relaxed">
              Built for discerning attendees and visionary creators, EventVerse
              bridges the gap between architectural cultural spaces and
              world-class live experiences. From intimate acoustical recitals
              and culinary residencies to expansive international design forums,
              we curate environments where art, sound, and architectural
              presence seamlessly converge.
            </p>

            {/* Features */}
            <div className="space-y-space-md pt-2">
              {/* Curated Venues */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <Building2 size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Curated Venues
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Exclusive access to iconic pavilions, private galleries, and
                    architectural landmarks vetted for cultural distinction.
                  </p>
                </div>
              </div>

              {/* Acoustic Fidelity */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <AudioLines size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Acoustic Fidelity
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Live audio environments calibrated for physical intimacy and
                    immersive presence without synthetic amplification
                    distortion.
                  </p>
                </div>
              </div>

              {/* Frictionless Entry */}
              <div className="flex items-start gap-space-md">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                  <ShieldCheck size={20} strokeWidth={1.5} />
                </div>

                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Frictionless Entry
                  </h3>

                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Biometric passes and contactless NFC dynamic tokens designed
                    for immediate, dignified access from curbside to seat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
