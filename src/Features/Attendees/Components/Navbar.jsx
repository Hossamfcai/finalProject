import { Menu } from "lucide-react";
import { navigationItems } from "../../../utils/constants";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserDropdown from "../../../Components/ui/user/UserDropdown";
const Navbar = ({ onMenuClick, items = navigationItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header className="flex bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-md">
        {/* Left section */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="cursor-pointer lg:invisible p-space-xs text-secondary hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-space-md">
          {/* Mobile / Tablet menu button */}

          <div className="hidden gap-10 lg:flex">
            {" "}
            {items.map((item, i) => {
              return (
                <a
                  key={i}
                  aria-current="page"
                  onClick={() => {
                    navigate(item.path);
                  }}
                  className={`cursor-pointer font-label-lg text-label-lg ${location.pathname.includes(item.path) ? "text-on-surface scale-115 font-extrabold" : "text-on-surface-variant font-semibold"} hover:text-on-surface hover:scale-105 transition-all duration-150`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-space-sm flex-shrink-0">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
