import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Compass, Heart } from "lucide-react";
import PageHeader from "../../../Components/ui/common/PageHeader";
import EmptyState from "../../../Components/ui/common/EmptyState";
import ErrorState from "../../../Components/ui/common/ErrorState";
import EventCard from "../../../Components/ui/EventDetails/EventCard";
import EventCardSkeleton from "../../../Components/ui/EventDetails/EventCardSkeleton";
import { getFavourites } from "../../../Store/Slices/eventsSlice";

export default function FavouritesEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favouriteEvents, favouritesLoading, favouritesError, events } =
    useSelector((state) => state.events);

  // the favourites endpoint returns bare events; enrich with the discovery
  // data (category, ticket types) when we already have it
  const favouriteCards = favouriteEvents
    .filter((favourite) => favourite.event)
    .map((favourite) => {
      const known = events.find((event) => event.id === favourite.eventId);
      return known ? { ...favourite.event, ...known } : favourite.event;
    });

  return (
    <div className="w-full bg-background">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/AttendeeDashboard" },
          { label: "Saved & Favorites" },
        ]}
        title="Saved & Favorites"
        description={`${favouriteCards.length} saved event${favouriteCards.length === 1 ? "" : "s"}. Tap the heart to remove one.`}
      />

      <section className="w-full py-space-xl px-gutter-mobile sm:px-gutter">
        <div className="max-w-[1360px] mx-auto">
          {favouritesLoading && favouriteEvents.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
              {Array.from({ length: 3 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : favouritesError && favouriteEvents.length === 0 ? (
            <ErrorState
              message={favouritesError}
              onRetry={() => dispatch(getFavourites())}
            />
          ) : favouriteCards.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="Save events you love from Discover Events and they will be waiting for you here."
              actionLabel="Discover Events"
              actionIcon={Compass}
              onAction={() => navigate("/AttendeeDashboard/DiscoverEvents")}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
              {favouriteCards.map((event) => (
                <EventCard data={event} key={event.id} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
