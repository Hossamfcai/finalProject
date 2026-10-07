import { Star, CalendarIcon } from "lucide-react";
import Navbar from "../../../Components/ui/Navbar";
import HeroSection from "../Components/HeroSection";
import Note from "../Components/Note";
import EventsSection from "../Components/EventSection";
import DiscoverEventsSection from "../Components/DiscoverEventsSection";
import CTABanner from "../Components/CTABanner";
import Footer from "../../../Components/ui/Footer";
import About from "../Components/AboutSection";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getEvents } from "../../../Store/Slices/eventsSlice";
const eventsSectionHeader = [
  {
    sectionName: "published",
    text: "Curator's Pick",
    icon: <Star className="text-[14px]" aria-hidden="true" />,
    headText: "Published Events",
    para: "Exceptional gatherings with limited physical capacities selected for autumn 2026.",
  },
  {
    sectionName: "upcoming",
    text: "Calendar Releases",
    icon: <CalendarIcon className="text-[14px]" aria-hidden="true" />,
    headText: "Upcoming Events",
    para: "Chronological performances, vernissages, and culinary residences for the upcoming season.",
  },
];

export default function LandingPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    // Check if a scrollTo target was passed via state
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Small timeout ensures the DOM is fully ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);
  useEffect(() => {
    dispatch(getEvents());
  }, []);

  return (
    <>
      <Navbar />
      <main className="w-full pt-20 bg-background">
        <div className="flex flex-col w-full">
          <HeroSection />
          <Note />

          {eventsSectionHeader.map((header, i) => {
            return (
              <EventsSection
                sectionName={header.sectionName}
                text={header.text}
                icon={header.icon}
                headText={header.headText}
                paragraph={header.para}
                key={i}
              />
            );
          })}

          <DiscoverEventsSection />
          <About />
          <CTABanner />
        </div>
      </main>
      <Footer />
    </>
  );
}
