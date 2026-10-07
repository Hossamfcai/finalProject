export default function EventCardSkeleton() {
  return (
    <article
      className="
        bg-surface-container-lowest
        rounded-2xl
        overflow-hidden
        shadow-sm
        flex
        flex-col
        justify-between
        animate-pulse
      "
    >
      {/* Image skeleton */}
      <div>
        <div className="relative w-full aspect-[16/10] bg-surface-container">
          {/* Category */}
          <div
            className="
              absolute
              top-space-md
              left-space-md
              w-20
              h-6
              rounded-full
              bg-surface-container-high
            "
          />

          {/* Favorite button */}
          <div
            className="
              absolute
              top-space-md
              right-space-md
              w-9
              h-9
              rounded-full
              bg-surface-container-high
            "
          />

          {/* Location */}
          <div
            className="
              absolute
              bottom-space-md
              left-space-md
              w-32
              h-4
              rounded
              bg-surface-container-high
            "
          />
        </div>

        {/* Content */}
        <div className="p-space-lg">
          {/* Date */}
          <div className="flex items-center gap-space-xs mb-3">
            <div className="w-20 h-3 rounded bg-surface-container-high" />

            <div className="w-1 h-1 rounded-full bg-surface-container-high" />

            <div className="w-24 h-3 rounded bg-surface-container-high" />
          </div>

          {/* Title */}
          <div className="w-3/4 h-6 rounded bg-surface-container-high" />

          {/* Description */}
          <div className="mt-3 space-y-2">
            <div className="w-full h-4 rounded bg-surface-container-high" />

            <div className="w-2/3 h-4 rounded bg-surface-container-high" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-space-lg pt-space-md bg-surface-container-low/50 flex items-center justify-between">
        {/* Price */}
        <div className="space-y-2">
          <div className="w-20 h-3 rounded bg-surface-container-high" />

          <div className="w-24 h-6 rounded bg-surface-container-high" />
        </div>

        {/* Button */}
        <div className="w-32 h-10 rounded-xl bg-surface-container-high" />
      </div>
    </article>
  );
}
