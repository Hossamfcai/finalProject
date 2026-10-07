import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds, options = {}) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    // Default rootMargin makes the active state trigger when the section crosses the upper-middle area
    const defaultOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
      ...options,
    };

    const observer = new IntersectionObserver(observerCallback, defaultOptions);

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sectionIds, options]);

  return activeId;
}
