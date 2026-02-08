"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const rafRef = useRef<number>(0);
  const scaleRef = useRef({ ring: 1, dot: 1, trail: 1 });

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const ringPos = { x: -100, y: -100 };
    const trailPos = { x: -100, y: -100 };

    const smoothFollow = () => {
      const target = posRef.current;

      ringPos.x += (target.x - ringPos.x) * 0.15;
      ringPos.y += (target.y - ringPos.y) * 0.15;

      trailPos.x += (target.x - trailPos.x) * 0.08;
      trailPos.y += (target.y - trailPos.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.left = `${target.x}px`;
        dotRef.current.style.top = `${target.y}px`;
      }

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.x}px`;
        ringRef.current.style.top = `${ringPos.y}px`;
      }

      if (trailRef.current) {
        trailRef.current.style.left = `${trailPos.x}px`;
        trailRef.current.style.top = `${trailPos.y}px`;
      }

      rafRef.current = requestAnimationFrame(smoothFollow);
    };

    rafRef.current = requestAnimationFrame(smoothFollow);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (!visibleRef.current) {
      visibleRef.current = true;
      [dotRef.current, ringRef.current, trailRef.current].forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    scaleRef.current.ring = 0.7;
    scaleRef.current.dot = 2;
    scaleRef.current.trail = 0.5;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 0.7,
        duration: 0.2,
        ease: "power2.out",
      });
    }
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 2,
        duration: 0.2,
        ease: "power2.out",
      });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, {
        scale: 0.5,
        opacity: 0.06,
        duration: 0.25,
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    scaleRef.current.ring = 1;
    scaleRef.current.dot = 1;
    scaleRef.current.trail = 1;

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    }
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, {
        scale: 1,
        opacity: 0.03,
        duration: 0.5,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    visibleRef.current = false;
    [dotRef.current, ringRef.current, trailRef.current].forEach((el) => {
      if (el) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        });
      }
    });
  }, []);

  const handleMouseEnterLink = useCallback(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 2.2,
        borderColor: "rgba(245, 245, 245, 0.35)",
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, {
        scale: 1.6,
        opacity: 0.05,
        duration: 0.45,
      });
    }
  }, []);

  const handleMouseLeaveLink = useCallback(() => {
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 1,
        borderColor: "rgba(245, 245, 245, 0.15)",
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, {
        scale: 1,
        opacity: 0.03,
        duration: 0.45,
      });
    }
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

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
      {/* Soft trail glow */}
      <div
        ref={trailRef}
        className="fixed w-[60px] h-[60px] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          marginLeft: "-30px",
          marginTop: "-30px",
          background:
            "radial-gradient(circle, rgba(245,245,245,0.12) 0%, transparent 70%)",
          willChange: "left, top, transform, opacity",
          transition: "opacity 0.4s ease",
        }}
      />
      {/* Small center dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 rounded-full bg-foreground pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          marginLeft: "-4px",
          marginTop: "-4px",
          willChange: "left, top, transform, opacity",
          transition: "opacity 0.4s ease",
        }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed w-10 h-10 rounded-full pointer-events-none z-[9999]"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          marginLeft: "-20px",
          marginTop: "-20px",
          border: "1.5px solid rgba(245, 245, 245, 0.15)",
          willChange: "left, top, transform, opacity",
          transition: "opacity 0.4s ease",
        }}
      />
    </>
  );
}
