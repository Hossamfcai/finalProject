import { sectionVariants } from "../../../utils/constantsVariants";
import { motion } from "framer-motion";
export default function EventDetailsSkeleton() {
  return (
    <motion.main
      className="w-full pt-20 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
    >
      <div className="flex flex-col w-full">
        <div className="w-full bg-background">
          <div className="max-w-[1360px] mx-auto px-gutter py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-8 flex flex-col gap-space-xl">
                {/* Event Header */}
                <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-lg">
                  {/* Status & Category */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-24 h-7 rounded-full bg-surface-container-high animate-pulse" />
                    <div className="w-48 h-7 rounded-full bg-surface-container-high animate-pulse" />
                  </div>
                  {/* Title */}
                  <div className="space-y-3">
                    <div className="w-3/4 h-12 md:h-16 rounded-lg bg-surface-container-high animate-pulse" />
                  </div>
                  {/* Event Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                    {/* Date */}
                    <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="w-24 h-4 rounded bg-surface-container-high animate-pulse" />
                        <div className="w-full h-5 rounded bg-surface-container-high animate-pulse" />
                        <div className="w-32 h-4 rounded bg-surface-container-high animate-pulse" />
                      </div>
                    </div>
                    {/* Venue */}
                    <div className="flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-high animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="w-20 h-4 rounded bg-surface-container-high animate-pulse" />
                        <div className="w-full h-5 rounded bg-surface-container-high animate-pulse" />
                        <div className="w-40 h-4 rounded bg-surface-container-high animate-pulse" />
                      </div>
                    </div>
                  </div>
                  {/* Hero Image */}
                  <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-surface-container-high animate-pulse" />
                </section>
                {/* ABOUT EVENT */}
                <section className="bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-sm space-y-space-md">
                  {/* Section Header */}
                  <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
                    <div className="w-32 h-4 rounded bg-surface-container-high animate-pulse" />
                    <div className="w-20 h-4 rounded bg-surface-container-high animate-pulse" />
                  </div>
                  {/* Heading */}
                  <div className="w-56 h-8 rounded bg-surface-container-high animate-pulse" />
                  {/* Description */}
                  <div className="space-y-3">
                    <div className="w-full h-5 rounded bg-surface-container-high animate-pulse" />
                    <div className="w-full h-5 rounded bg-surface-container-high animate-pulse" />
                    <div className="w-4/5 h-5 rounded bg-surface-container-high animate-pulse" />
                  </div>
                </section>
              </div>
              {/* RIGHT COLUMN TICKETS */}
              <aside className="lg:col-span-4 sticky top-28">
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl space-y-space-md">
                  {/* Ticket Header */}
                  <div className="flex items-center justify-between pb-space-sm">
                    <div className="space-y-2">
                      <div className="w-36 h-7 rounded bg-surface-container-high animate-pulse" />
                      <div className="w-56 h-4 rounded bg-surface-container-high animate-pulse" />
                    </div>
                    <div className="w-6 h-6 rounded bg-surface-container-high animate-pulse" />
                  </div>
                  {/* Ticket Skeleton */}
                  <div className="space-y-space-sm">
                    <div className="p-space-md rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2 pr-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="w-36 h-5 rounded bg-surface-container-high animate-pulse" />
                            <div className="w-32 h-5 rounded-full bg-surface-container-high animate-pulse" />
                          </div>
                          <div className="w-48 h-4 rounded bg-surface-container-high animate-pulse" />
                        </div>
                        <div className="flex-shrink-0 space-y-1">
                          <div className="w-16 h-7 rounded bg-surface-container-high animate-pulse" />
                          <div className="w-10 h-3 rounded bg-surface-container-high animate-pulse ml-auto" />
                        </div>
                      </div>
                      {/* Quantity */}
                      <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-outline-variant/20">
                        <div className="w-20 h-4 rounded bg-surface-container-high animate-pulse" />
                        <div className="flex items-center gap-3 bg-surface-container px-3 py-1 rounded-full">
                          <div className="w-7 h-7 rounded-full bg-surface-container-lowest animate-pulse" />
                          <div className="w-6 h-5 rounded bg-surface-container-lowest animate-pulse" />
                          <div className="w-7 h-7 rounded-full bg-surface-container-lowest animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Price Breakdown */}
                  <div className="pt-space-md space-y-space-xs bg-surface-container-low p-space-md rounded-xl">
                    <div className="h-5 w-full rounded bg-surface-container-high animate-pulse" />
                    <div className="flex items-center justify-between pt-space-xs mt-space-xs border-t border-outline-variant/40">
                      <div className="space-y-2">
                        <div className="w-20 h-6 rounded bg-surface-container-high animate-pulse" />
                        <div className="w-28 h-3 rounded bg-surface-container-high animate-pulse" />
                      </div>
                      <div className="w-20 h-7 rounded bg-surface-container-high animate-pulse" />
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="space-y-space-sm pt-space-xs">
                    <div className="w-full h-14 rounded-xl bg-surface-container-high animate-pulse" />
                    <div className="w-full h-11 rounded-xl bg-surface-container-high animate-pulse" />
                  </div>
                  {/* Trust Badges */}
                  <div className="pt-space-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-surface-container-high animate-pulse flex-shrink-0" />
                      <div className="w-full h-4 rounded bg-surface-container-high animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-surface-container-high animate-pulse flex-shrink-0" />
                      <div className="w-full h-4 rounded bg-surface-container-high animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-surface-container-high animate-pulse flex-shrink-0" />
                      <div className="w-full h-4 rounded bg-surface-container-high animate-pulse" />
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
