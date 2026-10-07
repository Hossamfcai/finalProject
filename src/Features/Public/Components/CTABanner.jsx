import { sectionVariants } from "../../../utils/constantsVariants";
import { motion } from "framer-motion";
import { Ticket, Rocket, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function CTABanner() {
  const navigate = useNavigate();
  return (
    <motion.section
      className="w-full py-space-xl bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="max-w-[1360px] mx-auto px-gutter">
        <div className="bg-primary text-on-primary rounded-3xl p-space-lg lg:p-space-xl relative overflow-hidden shadow-2xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-7 space-y-space-md">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-surface-bright font-label-sm text-label-sm uppercase tracking-wider">
                <Ticket className="text-[14px]" aria-hidden="true" />
                Curator & Promoter Suite
              </span>
              <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-primary tracking-tight font-bold max-w-xl leading-tight">
                Host your next landmark experience on EventVerse
              </h2>
              <p className="font-body-md text-body-md text-secondary-fixed max-w-lg leading-relaxed">
                Equip your production with enterprise tier admission control,
                dynamic reserved seating, real-time analytics, and guaranteed
                payouts within 24 hours of curtain call.
              </p>
              <div className="pt-space-sm flex flex-wrap items-center gap-space-md">
                <a
                  className="cursor-pointer font-label-lg text-label-lg bg-surface-container-lowest text-primary hover:bg-surface-container-high px-space-xl py-3.5 rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-space-xs font-semibold"
                  data-path="become-an-organizer"
                  onClick={() => {
                    navigate("/Authentication/Resgistration");
                  }}
                >
                  <span>Launch Your Event</span>
                  <Rocket className="text-[18px]" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface-container-lowest/5 backdrop-blur-md p-space-lg rounded-2xl">
              <div className="grid grid-cols-2 gap-space-md">
                <div>
                  <span className="font-display-hero text-headline-lg font-bold text-on-primary block">
                    99.9%
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1 block">
                    Gate Scan Uptime
                  </span>
                </div>
                <div>
                  <span className="font-display-hero text-headline-lg font-bold text-on-primary block">
                    0.8s
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1 block">
                    Scan Validation
                  </span>
                </div>
                <div>
                  <span className="font-display-hero text-headline-lg font-bold text-on-primary block">
                    2.4%
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1 block">
                    Flat Processing Fee
                  </span>
                </div>
                <div>
                  <span className="font-display-hero text-headline-lg font-bold text-on-primary block">
                    24h
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary-fixed mt-1 block">
                    Guaranteed Settlement
                  </span>
                </div>
              </div>
              <div className="mt-space-md pt-space-md flex items-center gap-space-sm text-secondary-fixed text-body-sm font-body-sm">
                <ShieldCheck
                  className="text-[20px] text-surface-bright"
                  aria-hidden="true"
                />
                <span>
                  Fully PCI-DSS Level 1 Compliant with Automated Chargeback
                  Defense.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
