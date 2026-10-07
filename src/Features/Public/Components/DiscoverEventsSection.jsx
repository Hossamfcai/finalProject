import { sectionVariants } from "../../../utils/constantsVariants";
import { motion } from "framer-motion";
import {
  Compass,
  CircleCheck,
  Lock,
  BadgeCheck,
  ScanQrCode,
  WifiOff,
} from "lucide-react";
export default function DiscoverEventsSection() {
  return (
    <motion.section
      className="w-full py-28 bg-surface-container-low"
      initial="hidden"
      id="howItWorks"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="max-w-[1360px] mx-auto px-gutter">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-semibold">
            The Infrastructure
          </span>
          <h2 className="font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface tracking-tight mt-2">
            Frictionless from Discovery to the Door
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-3">
            Engineered for cultural enthusiasts who value discretion, speed, and
            uncompromising ticketing integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative">
          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md group-hover:scale-105 transition-transform">
              <Compass className="text-[28px]" aria-hidden="true" />
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-semibold">
              Phase 01
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
              Curated Discovery
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Filter verified intimate sessions, private salons, and arena-scale
              gatherings with typographic precision and location intelligence.
            </p>
            <div className="mt-6 flex items-center gap-1 text-primary font-label-md text-label-md">
              <span>Verified Curators</span>
              <CircleCheck className="text-[16px]" aria-hidden="true" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md group-hover:scale-105 transition-transform">
              <Lock className="text-[28px]" aria-hidden="true" />
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-semibold">
              Phase 02
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
              Instant Smart Booking
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Transparent pricing, guaranteed anti-scalper digital passes, zero
              hidden checkout markups, and one-tap biometric Apple/Google pay.
            </p>
            <div className="mt-6 flex items-center gap-1 text-primary font-label-md text-label-md">
              <span>Zero Sneak Fees</span>
              <BadgeCheck className="text-[16px]" aria-hidden="true" />
            </div>
          </div>

          <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary mb-space-md group-hover:scale-105 transition-transform">
              <ScanQrCode className="text-[28px]" aria-hidden="true" />
            </div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline font-semibold">
              Phase 03
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-1">
              Seamless QR Entry
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
              Access your offline digital wallet pass anywhere. Instant Contact
              millimeter scan at the gate with dynamic token refreshing.
            </p>
            <div className="mt-6 flex items-center gap-1 text-primary font-label-md text-label-md">
              <span>Offline Guaranteed</span>
              <WifiOff className="text-[16px]" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* <div className="mt-12 bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <WalletCards className="text-[24px]" aria-hidden="true" />
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Passes Sync to Apple Wallet & Google Wallet
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time gate updates, schedule revisions, and seat map
                navigation right on your lockscreen.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm flex-shrink-0">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              <Contact className="text-[14px]" aria-hidden="true" />
              Contact NFC Supported
            </span>
          </div>
        </div> */}
      </div>
    </motion.section>
  );
}
