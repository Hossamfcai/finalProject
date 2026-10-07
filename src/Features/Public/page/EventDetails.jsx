import Navbar from "../../../Components/ui/Navbar";
import Footer from "../../../Components/ui/Footer";
import { useDispatch, useSelector } from "react-redux";
import Note from "../Components/Note";
import EventHeader from "../../../Components/ui/EventDetails/EventHeader";
import EventDescription from "../../../Components/ui/EventDetails/EventDescription";
import EventReviews from "../../../Components/ui/EventDetails/EventReviews";
import EventTopBar from "../../../Components/ui/EventDetails/EventTopBar";

import EventDetailsSkeleton from "../../../Components/ui/EventDetails/EventDetailsSkeleton";
import TicketTypesContainer from "../../../Components/ui/TicketTypes/TicketTypesContainer";
import EmptyState from "../../../Components/ui/common/EmptyState";
import ErrorState from "../../../Components/ui/common/ErrorState";
import { useEffect } from "react";
import { getSingleEvent } from "../../../Store/Slices/eventsSlice";
import { getEventReviews } from "../../../Store/Slices/reviewsSlice";
import { getuserData } from "../../Authentication/Slices/authSlice";
import { getFavourites } from "../../../Store/Slices/eventsSlice";
import { getLocalStorageItem } from "../../../utils/localStorage";
import { useNavigate, useParams } from "react-router-dom";
import { Compass, SearchX } from "lucide-react";
export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { loading, error, notFound, specificEvent } = useSelector(
    (state) => state.events,
  );
  // this page lives outside the dashboards, so restore the session on refresh
  const hasToken = Boolean(getLocalStorageItem("token"));
  const showPublicChrome = !isAuthenticated && !hasToken;

  useEffect(() => {
    if (hasToken && !user?.id) {
      dispatch(getuserData());
      dispatch(getFavourites());
    }
  }, [dispatch, hasToken, user?.id]);

  useEffect(() => {
    dispatch(getSingleEvent(id));
    dispatch(getEventReviews(id));
  }, [dispatch, id]);

  const renderContent = () => {
    // also covers the first render, before the stale previous event is cleared
    if (loading || (specificEvent?.id !== id && !error)) {
      return <EventDetailsSkeleton />;
    }
    if (error) {
      return (
        <main className="w-full pt-20 bg-background">
          <div className="max-w-[1360px] mx-auto px-gutter-mobile sm:px-gutter py-space-xl">
            {notFound ? (
              <EmptyState
                icon={SearchX}
                title="Event not found"
                description="This event may have been removed by its organizer or the link is incorrect."
                actionLabel="Discover Events"
                actionIcon={Compass}
                onAction={() =>
                  navigate(
                    isAuthenticated ? "/AttendeeDashboard/DiscoverEvents" : "/",
                  )
                }
              />
            ) : (
              <ErrorState
                message={error}
                onRetry={() => {
                  dispatch(getSingleEvent(id));
                  dispatch(getEventReviews(id));
                }}
              />
            )}
          </div>
        </main>
      );
    }
    return (
      <main className="w-full pt-20 bg-background">
        {showPublicChrome && <Note />}
        <div className="flex flex-col w-full">
          <div className="w-full bg-background">
            <div className="max-w-[1360px] mx-auto px-gutter py-space-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                {/*  LEFT COLUMN */}
                <div className="lg:col-span-8 flex flex-col gap-space-xl">
                  {/* Event Header */}
                  <EventHeader />
                  {/* ABOUT EVENT*/}
                  <EventDescription />
                  {/* REVIEWS */}
                  <EventReviews eventId={id} />
                </div>
                {/*  RIGHT COLUMN TICKETS  */}
                <TicketTypesContainer key={specificEvent.id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <>
      {showPublicChrome ? <Navbar /> : <EventTopBar />}
      {renderContent()}
      {showPublicChrome && <Footer />}
    </>
  );
}
