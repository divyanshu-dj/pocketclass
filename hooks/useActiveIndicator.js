import { useEffect, useRef, useState, useCallback } from "react";

export const useActiveIndicator = () => {
  const containerRef = useRef(null);
  const [activeStyle, setActiveStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const updateIndicator = useCallback((index = 0) => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(".search-bar-option");
    if (!items.length || index >= items.length) return;

    const target = items[index];

    if (target) {
      // Switch hover states
      items.forEach((item) => {
        const initial = item.querySelector(".search-hover.initial");
        const active = item.querySelector(".search-hover.active");
        if (initial && active) {
          initial.classList.add("hidden");
          active.classList.remove("hidden");
        }
      });

      // Smooth transition after layout
      requestAnimationFrame(() => {
        const { offsetLeft, offsetWidth } = target;
        setActiveStyle({
          left: offsetLeft,
          width: offsetWidth,
          opacity: 1,
        });
      });
    }
  }, []);

  const resetActiveBG = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const items = container.querySelectorAll(".search-bar-option");
      items.forEach((item) => {
        const initial = item.querySelector(".search-hover.initial");
        const active = item.querySelector(".search-hover.active");
        if (initial && active) {
          initial.classList.remove("hidden");
          active.classList.add("hidden");
        }
      });

      // Fade out the active bg
      setActiveStyle((prev) => ({ ...prev, opacity: 0 }));
    });
  }, []);

  // ResizeObserver: dynamic layout support
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      // Recalculate the active style (fallback to first if index not tracked)
      const items = container.querySelectorAll(".search-bar-option");
      const activeIndex = Array.from(items).findIndex((item) =>
        item.querySelector(".search-hover.active:not(.hidden)")
      );
      updateIndicator(activeIndex !== -1 ? activeIndex : 0);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [updateIndicator]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        resetActiveBG();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resetActiveBG]);

  return {
    containerRef,
    activeStyle,
    updateIndicator,
    resetActiveBG,
  };
};
