import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "../../../Components/ui/EventDetails/EventCard";
import EventCardSkeleton from "../../../Components/ui/EventDetails/EventCardSkeleton";
import EventSearch from "../../../Components/ui/EventDetails/EventSearch";
import EventCategory from "../../../Components/ui/EventDetails/EventCategory";
import { sectionVariantsEaseOut } from "../../../utils/constantsVariants";
import FilterDate from "../../../Components/ui/EventDetails/FilterDate";
import { searchOnEvents } from "../../../Store/Slices/eventsSlice";
import EventEmptyState from "../../../Components/ui/EventDetails/EventEmptyState";
import EventPagination from "../../../Components/ui/EventDetails/EventPagination";

function DiscoverEvents() {
  const [selectedDate, setSelectedDate] = useState("");
  const topRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { loading, categories, searchEvents, pagination, filters } =
    useSelector((state) => state.events);

  const handleCategoryChange = (category) => {
    setSelectedCategory({ ...category });
  };
  const handleSelectedDate = (value) => {
    setSelectedDate(value);
  };
  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory({});
    setSelectedDate("");
    dispatch(searchOnEvents({ search: "", category: "", date: "", page: 1 }));
  };

  function handleFilters() {
    dispatch(
      searchOnEvents({
        search,
        category: selectedCategory?.id,
        date: selectedDate,
        page: 1,
      }),
    );
  }
  const handlePageChange = (newPage) => {
    dispatch(
      searchOnEvents({
        ...filters, // last APPLIED filters, not the draft inputs
        page: newPage,
        limit: pagination.limit,
      }),
    );
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div ref={topRef} className="w-full bg-background">
      <div className="flex flex-col w-full">
        {/* ================================================= SEARCH & FILTER STRIP ================================================== */}
        <motion.section
          className="w-full bg-surface-container-low py-space-lg px-gutter border-b border-surface-container-high"
          initial="hidden"
          animate="visible"
          variants={sectionVariantsEaseOut}
        >
          <div className="max-w-[1360px] mx-auto flex flex-col gap-space-md">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
              <a href="#" className="hover:text-on-surface transition-colors">
                Home
              </a>

              <span className="text-outline"> / </span>

              <span className="text-on-surface font-semibold">
                Discover Events
              </span>
            </nav>

            {/* Search */}

            {/* Result Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md pt-space-xs">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Discover Upcoming Events
                </h1>

                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Showing
                  <span className="font-semibold text-on-surface mx-1">
                    {pagination.total} curated events
                  </span>
                  matching your preferences
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================================================= CONTENT ================================================== */}
        <section className="w-full py-space-xl px-gutter">
          <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
            <EventSearch
              handleSearch={handleSearch}
              handleFilters={handleFilters}
              handleResetFilters={handleResetFilters}
              search={search}
            />
            {/* ================================================= FILTERS ================================================== */}
            <motion.section
              className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-space-md"
              initial="hidden"
              animate="visible"
              variants={sectionVariantsEaseOut}
            >
              {/* Filter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-low text-on-surface">
                    <SlidersHorizontal size={17} />
                  </div>

                  <div>
                    <h2 className="font-label-md text-label-md font-bold uppercase tracking-wider text-on-surface">
                      Filters
                    </h2>

                    <p className="font-body-sm text-body-sm text-outline">
                      Refine your event discovery
                    </p>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handleResetFilters}
                  className="self-start sm:self-auto font-label-sm text-label-sm text-secondary hover:text-on-surface underline transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  Reset all filters
                </motion.button>
              </div>

              {/* ================================================= CATEGORIES ================================================== */}
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                  Categories
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-xs">
                  {categories.map((category, index) => {
                    return (
                      <EventCategory
                        category={category}
                        key={category.id}
                        handleCategoryChange={handleCategoryChange}
                        id={selectedCategory.id}
                        index={index}
                      />
                    );
                  })}
                </div>
              </div>

              {/* ================================================= OTHER FILTERS ================================================== */}
              <div className="mt-space-md pt-space-md border-t border-surface-container-high">
                <div className="flex flex-col lg:flex-row justify-between gap-space-md">
                  {/* Date */}
                  <FilterDate
                    handleSelectedDate={handleSelectedDate}
                    selectedDate={selectedDate}
                  />

                  <div className=" flex items-end gap-space-xs pl-space-xs">
                    {/* Find Tickets */}
                    <motion.button
                      type="button"
                      onClick={() => {
                        handleFilters();
                      }}
                      disabled={
                        selectedCategory?.id == undefined &&
                        search == "" &&
                        selectedDate == ""
                      }
                      className="disabled:bg-surface-container-low disabled:text-on-surface-variant w-full flex justify-center bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-primary-container transition-colors flex items-center gap-space-xs whitespace-nowrap"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span> Find Events </span> <ArrowRight size={18} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ================================================= EVENT CATALOG ================================================== */}
            <main className="w-full flex flex-col gap-space-lg">
              {/* Event Cards Grid */}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <EventCardSkeleton key={i} />
                  ))}
                </div>
              ) : searchEvents.length === 0 ? (
                <EventEmptyState search={search} onReset={handleResetFilters} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
                  {searchEvents.map((eventItem) => (
                    <EventCard data={eventItem} key={eventItem.id} />
                  ))}
                </div>
              )}

              {/* ================================================= PAGINATION / LOAD MORE ================================================== */}
              <EventPagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                disabled={loading}
              />
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DiscoverEvents;
