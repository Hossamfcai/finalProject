import { useState } from "react";
import { useScrollSpy } from "../../Hooks/useScrollSpy";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo from "./Logo";
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sectionIds = ["home", "published", "upcoming", "howItWorks", "aboutus"];
  const navigate = useNavigate();
  const items = [
    { href: "home", title: "DiscoverEvents" },
    { href: "published", title: "Published Events" },
    { href: "upcoming", title: "UpComing Events" },
    { href: "howItWorks", title: "How It Works" },
    { href: "aboutus", title: "About Us" },
  ];
  const activeId = useScrollSpy(sectionIds);
  const location = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
      <div className="h-20 max-w-[1360px] mx-auto px-gutter flex items-center justify-between gap-space-md">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-space-lg"
          data-active-classes="text-on-surface font-semibold"
        >
          {location.pathname.includes("landingPage")
            ? items.map((item, i) => {
                const isActive = activeId === item.href;
                return (
                  <a
                    key={i}
                    aria-current="page"
                    className={`cursor-pointer font-label-lg text-label-lg ${isActive ? "text-on-surface scale-105" : "text-on-surface-variant font-semibold"} hover:text-on-surface transition-all duration-150`}
                    href={`#${item.href}`}
                  >
                    {item.title}
                  </a>
                );
              })
            : items.map((item, i) => {
                const isActive = activeId === item.href;
                return (
                  <a
                    key={i}
                    aria-current="page"
                    className={`cursor-pointer font-label-lg text-label-lg ${isActive ? "text-on-surface font-extrabold" : "text-on-surface-variant font-semibold"} hover:text-on-surface transition-all duration-150`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/landingPage#`, {
                        state: { scrollTo: item.href },
                      });
                    }}
                  >
                    {item.title}
                  </a>
                );
              })}
        </nav>

        {/* Desktop Authentication */}
        <div className="hidden xl:flex items-center gap-space-sm flex-shrink-0">
          {!location.pathname.includes("Login") && (
            <a
              className="cursor-pointer font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface px-space-sm py-space-xs transition-colors"
              onClick={() => {
                navigate("/Authentication/Login");
              }}
            >
              Sign In
            </a>
          )}

          {!location.pathname.includes("Resgistration") && (
            <a
              className="cursor-pointer font-label-lg text-label-lg text-on-surface bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low px-space-md py-space-xs rounded-full transition-colors"
              onClick={() => {
                navigate("/Authentication/Resgistration");
              }}
            >
              Sign Up
            </a>
          )}
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="
            xl:hidden
            flex items-center justify-center
            w-10 h-10
            rounded-xl
            border border-outline-variant
            bg-surface-container
            text-on-surface
            hover:bg-surface-container-high
            transition-colors
          "
        >
          {isMenuOpen ? (
            /* X icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            /* Menu icon */
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 7H20" />
              <path d="M4 12H20" />
              <path d="M4 17H20" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile / Tablet Dropdown */}
      {isMenuOpen && (
        <div className="xl:hidden border-t border-outline-variant bg-surface">
          <div className="max-w-[1360px] mx-auto px-gutter py-space-md">
            {/* Navigation Links */}
            <nav className="flex flex-col">
              {location.pathname.includes("landingPage")
                ? items.map((item, i) => {
                    const isActive = activeId === item.href;
                    return (
                      <a
                        key={i}
                        href={`#${item.href}`}
                        onClick={closeMenu}
                        className={`font-label-lg text-label-lg ${isActive ? " text-on-surface font-extrabold" : "text-on-surface-variant font-semibold"} font-semibold px-space-md py-3 rounded-xl hover:bg-surface-container transition-colors`}
                      >
                        {item.title}
                      </a>
                    );
                  })
                : items.map((item, i) => {
                    const isActive = activeId === item.href;
                    return (
                      <a
                        key={i}
                        href={`#${item.href}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/landingPage#`, {
                            state: { scrollTo: item.href },
                          });
                          closeMenu();
                        }}
                        className={`font-label-lg text-label-lg ${isActive ? " text-on-surface font-extrabold" : "text-on-surface-variant font-semibold"} font-semibold px-space-md py-3 rounded-xl hover:bg-surface-container transition-colors`}
                      >
                        {item.title}
                      </a>
                    );
                  })}
            </nav>

            {/* Divider */}
            <div className="my-space-sm border-t border-outline-variant" />

            {/* Authentication */}
            <div className="flex flex-col gap-space-xs">
              {!location.pathname.includes("Login") && (
                <a
                  onClick={() => {
                    closeMenu();
                    navigate("/Authentication/Login");
                  }}
                  className="
                  font-label-lg text-label-lg
                  text-on-surface-variant
                  px-space-md py-3
                  rounded-xl
                  hover:bg-surface-container
                  hover:text-on-surface
                  transition-colors
                "
                >
                  Sign In
                </a>
              )}

              {!location.pathname.includes("Resgistration") && (
                <a
                  onClick={() => {
                    closeMenu();
                    navigate("/Authentication/Resgistration");
                  }}
                  className="
                  font-label-lg text-label-lg
                  text-center
                  text-on-primary
                  bg-primary
                  px-space-md py-3
                  rounded-xl
                  hover:bg-primary-container
                  transition-colors
                "
                >
                  Sign Up
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
