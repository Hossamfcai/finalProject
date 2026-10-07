import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Change to 'react-router' if using v7

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
