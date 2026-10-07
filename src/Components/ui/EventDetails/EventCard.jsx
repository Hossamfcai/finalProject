import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Ticket, ArrowRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import defaultImage from "../../../assets/images/event_defaultImg.png";
import { cardVariants } from "../../../utils/constantsVariants";
import { formatedDate } from "../../../utils/formatedDate";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoutite,
  removeFavourite,
} from "../../../Store/Slices/eventsSlice";
import { showErrorAlert } from "../../../utils/sweetAlertNotifications";
export default function EventCard({ data }) {
  const dispatch = useDispatch();
  const { favouriteEvents, pendingFavouriteIds } = useSelector(
    (state) => state.events,
  );
  const navigate = useNavigate();
  const location = useLocation();
  const formattedDate = formatedDate(data?.date);
  const isActive = favouriteEvents.some(
    (eventItem) => eventItem.eventId == data?.id,
  );
  const isPending = pendingFavouriteIds.includes(data?.id);
  const showFavourite =
    location.pathname.includes("DiscoverEvents") ||
    location.pathname.includes("FavouritesEvents");
  // cheapest ticket; the favourites endpoint returns events without ticket types
  const cheapestTicket = [...(data?.ticketTypes ?? [])].sort(
    (a, b) => a.price - b.price,
  )[0];

  const toggleFavourite = async () => {
    if (isPending) return;
    const thunk = isActive ? removeFavourite : addFavoutite;
    const result = await dispatch(thunk(data?.id));
    if (thunk.rejected.match(result)) {
      showErrorAlert("Favorites", "We could not update your favorites.");
    }
  };

  return (
    <motion.article
      className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      <div>
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-container">
          <img
            src={data?.imageUrl ? data?.imageUrl : defaultImage}
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>

          <div className="absolute top-space-md left-space-md right-space-md flex items-center justify-between pointer-events-none">
            {data?.category?.name ? (
              <span className="pointer-events-auto bg-primary text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm uppercase tracking-wider shadow-sm">
                {data?.category?.name}
              </span>
            ) : (
              <span />
            )}
            {showFavourite && (
              <button
                type="button"
                onClick={toggleFavourite}
                disabled={isPending}
                aria-pressed={isActive}
                aria-label={isActive ? "Remove from favorites" : "Save Event"}
                className={`cursor-pointer hover:scale-105 transition-transform pointer-events-auto w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md ${isActive ? "text-error" : "text-primary"} hover:bg-surface-container-lowest flex items-center justify-center transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait`}
              >
                <Heart
                  aria-hidden="true"
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? "fill-current" : ""}
                />
              </button>
            )}
          </div>

          <div className="absolute bottom-space-md left-space-md text-on-primary flex items-center gap-1.5 font-label-sm text-label-sm">
            <MapPin className="text-[16px]" aria-hidden="true" />
            <span>{data?.address}</span>
          </div>
        </div>

        <div className="p-space-lg">
          <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{`${data?.startTime} - ${data?.endTime}`}</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-secondary transition-colors">
            {data?.title}
          </h3>
          <p className="mt-2 font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
            {data?.description}
          </p>
        </div>
      </div>

      <div className="p-space-lg pt-space-md bg-surface-container-low/50 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-label-sm text-on-surface-variant block">
            {cheapestTicket?.name ?? data?.venue}
          </span>
          <div className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {cheapestTicket
              ? `From $${cheapestTicket.price}`
              : data?.ticketTypes
                ? "Tickets soon"
                : formattedDate}
          </div>
        </div>
        <button
          onClick={() => {
            navigate(`/Eventdetails/${data?.id}`);
          }}
          className="hover:scale-105 transition-transform duration-300 drop-shadow-xl cursor-pointer font-label-lg text-label-lg bg-primary hover:bg-primary-container text-on-primary px-space-md py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 group"
        >
          {location.pathname.includes("DiscoverEvents") ? (
            <>
              <span>Book Ticket</span>
              <Ticket
                className="text-[16px] group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </>
          ) : (
            <>
              {" "}
              <span>View Detials</span>
              <ArrowRight className="text-[16px] " aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
