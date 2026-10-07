import { Globe2, Radio, Rss } from "lucide-react";
import logo from "../../assets/icons/eventverse-logo-black.svg";
export default function Footer() {
  return (
    <footer className="w-full bg-primary text-surface-container border-t border-inverse-surface">
      <div className="max-w-[1360px] mx-auto px-gutter pt-space-xl pb-space-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-xl border-b border-inverse-surface">
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex">
              <img src={logo} alt="EventVerse" className="w-45 h-auto" />
            </div>
            <p className="font-body-sm text-body-sm text-secondary-fixed max-w-sm">
              An architectural curation platform connecting discerning audiences
              with premier cultural events, high-profile symposia, and private
              artistic showcases worldwide.
            </p>
            <div className="pt-space-sm">
              <p className="font-label-sm text-label-sm text-on-tertiary tracking-widest uppercase mb-space-xs">
                Subscribe to the Dispatch
              </p>
              <div className="flex items-center rounded-full bg-inverse-surface p-space-xs border border-on-surface-variant/30 max-w-sm">
                <input
                  className="bg-transparent font-body-sm text-body-sm text-on-tertiary placeholder-on-tertiary-container px-space-sm py-space-xs w-full focus:outline-none"
                  placeholder="Enter your email"
                  type="email"
                />
                <button className="font-label-md text-label-md bg-surface-container-lowest text-on-surface hover:bg-surface-container-high px-space-md py-space-xs rounded-full transition-colors flex-shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-tertiary uppercase tracking-wider font-semibold">
              Explore
            </h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-secondary-fixed">
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="discover-events"
                  href="#"
                >
                  Concerts
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="discover-events"
                  href="#"
                >
                  Conferences
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="discover-events"
                  href="#"
                >
                  Festivals
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="discover-events"
                  href="#"
                >
                  Arts & Exhibitions
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="discover-events"
                  href="#"
                >
                  Workshops
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-tertiary uppercase tracking-wider font-semibold">
              Organizers
            </h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-secondary-fixed">
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="become-an-organizer"
                  href="#"
                >
                  Sell Tickets
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="organizer-dashboard"
                  href="#"
                >
                  Event Dashboard
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="become-an-organizer"
                  href="#"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="organizer-dashboard"
                  href="#"
                >
                  QR Scanner
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-tertiary uppercase tracking-wider font-semibold">
              Company
            </h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-secondary-fixed">
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="how-it-works"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="editorial"
                  href="#"
                >
                  Editorial
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="press"
                  href="#"
                >
                  Press
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="careers"
                  href="#"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-2 space-y-space-sm">
            <h3 className="font-label-sm text-label-sm text-on-tertiary uppercase tracking-wider font-semibold">
              Legal & Support
            </h3>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-secondary-fixed">
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="help-center"
                  href="#"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="terms-of-service"
                  href="#"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className="hover:text-on-tertiary transition-colors"
                  data-path="privacy-policy"
                  href="#"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-secondary-fixed">
          <p>
            © 2025 EventVerse Inc. Architectural ticketing and cultural
            curation. All rights reserved.
          </p>
          <div className="flex items-center gap-space-md">
            <a
              aria-label="Global Network"
              className="hover:text-on-tertiary transition-colors"
              href="#"
            >
              <Globe2 className="text-[20px]" aria-hidden="true" />
            </a>
            <a
              aria-label="Broadcast Hub"
              className="hover:text-on-tertiary transition-colors"
              href="#"
            >
              <Radio className="text-[20px]" aria-hidden="true" />
            </a>
            <a
              aria-label="Verified RSS"
              className="hover:text-on-tertiary transition-colors"
              href="#"
            >
              <Rss className="text-[20px]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
