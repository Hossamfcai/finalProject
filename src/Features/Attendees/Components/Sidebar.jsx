import { motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { navigationItems } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Authentication/Slices/authSlice";
import { showConfirmDialog } from "../../../utils/sweetAlertNotifications";
import Logo from "../../../Components/ui/Logo";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onClose, items = navigationItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const ticketsTotal = useSelector((state) => state.tickets.pagination.total);
  const favouritesTotal = useSelector(
    (state) => state.events.favouriteEvents.length,
  );
  const organizerEventsTotal = useSelector(
    (state) => state.organizer.pagination.total,
  );
  const badges = {
    tickets: ticketsTotal,
    favourites: favouritesTotal,
    organizerEvents: organizerEventsTotal,
  };
  const handleNavigation = (path) => {
    // Close only on mobile and tablet.
    // Desktop navigation keeps the sidebar open.
    if (window.innerWidth < 1024) {
      onClose();
    }
    navigate(path);
  };
  const handleLogout = async () => {
    const confirmed = await showConfirmDialog({
      title: "Log out?",
      message: "You will need to sign in again to access your account.",
      confirmText: "Log Out",
      danger: true,
    });
    if (!confirmed) return;
    await dispatch(logoutUser());
    navigate("/landingPage", { replace: true });
  };
  return (
    <>
      {/* Mobile / Tablet backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 top-20 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : "-100%",
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 35,
        }}
        className=" fixed top-0 left-0 bottom-0 z-100 w-90 lg:z-0 lg:static lg:flex bg-surface border-r border-outline-variant flex flex-col overflow-y-auto lg:translate-x-0"
      >
        {/* Mobile / Tablet close button */}

        <div className="flex flex-col justify-between p-space-md pt-5 lg:pt-space-md space-y-space-lg min-h-screen">
          <div className="space-y-space-lg ">
            <div className="flex justify-between">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="flex lg:hidden p-space-xs text-secondary hover:text-on-surface hover:scale-110 rounded-full transition-transform"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-3">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(item.path);
                const badge = item.badgeKey ? badges[item.badgeKey] : null;

                return (
                  <a
                    key={item.path}
                    data-path={item.path}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      handleNavigation(item.path);
                    }}
                    className={`cursor-pointer flex items-center justify-between px-space-sm py-2 rounded-xl transition-colors font-label-lg text-label-lg 
                    ${
                      isActive
                        ? "bg-surface-container-high text-on-surface font-semibold scale-105"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low hover:scale-105 transition-transform "
                    }
                    `}
                  >
                    <span className="flex items-center gap-space-sm">
                      <Icon size={20} strokeWidth={isActive ? 2.2 : 2} />

                      {item.label}
                    </span>

                    {badge > 0 && (
                      <span
                        className={`
                          font-label-sm
                          text-label-sm
                          px-2
                          py-0.5
                          rounded-full
                          ${
                            isActive
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-high text-on-surface-variant"
                          }
                        `}
                      >
                        {badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="mt-auto p-space-md border-t border-outline-variant">
            <button
              type="button"
              onClick={handleLogout}
              className="cursor-pointer flex w-full items-center gap-2.5 px-4 py-2 text-sm text-error   rounded-xl hover:bg-error-container/20 transition-colors font-semibold"
            >
              <LogOut size={20} strokeWidth={1.5} />

              <span>Log Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
