"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      if (!visibleRef.current) {
        visibleRef.current = true;
        gsap.to([dotRef.current, ringRef.current], {
          opacity: 1,
          duration: 0.3,
        });
      }

      // Dot follows instantly
      gsap.set(dotRef.current, {
        x: e.clientX,
        y: e.clientY,
      });

      // Ring follows with smooth lag
      gsap.to(ringRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    },
    []
  );

  const handleMouseDown = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 0.8,
      duration: 0.15,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 1.5,
      duration: 0.15,
      ease: "power2.out",
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.4)",
    });
    gsap.to(dotRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    visibleRef.current = false;
    gsap.to([dotRef.current, ringRef.current], {
      opacity: 0,
      duration: 0.3,
    });
  }, []);

  const handleMouseEnterLink = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 1.8,
      borderColor: "rgba(250, 250, 250, 0.4)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handleMouseLeaveLink = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 1,
      borderColor: "rgba(250, 250, 250, 0.15)",
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Observe interactive elements for hover effect
    const attachLinkListeners = () => {
      const links = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      links.forEach((link) => {
        link.addEventListener("mouseenter", handleMouseEnterLink);
        link.addEventListener("mouseleave", handleMouseLeaveLink);
      });
      return links;
    };

    const links = attachLinkListeners();

    // MutationObserver to catch dynamically added elements
    const observer = new MutationObserver(() => {
      attachLinkListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnterLink);
        link.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
      observer.disconnect();
    };
  }, [
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseEnterLink,
    handleMouseLeaveLink,
  ]);

  return (
    <>
      {/* Small center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-foreground pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{
          opacity: 0,
          border: "1px solid rgba(250, 250, 250, 0.15)",
        }}
      />
    </>
  );
}
