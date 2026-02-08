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

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const ringPos = { x: -100, y: -100 };
    const trailPos = { x: -100, y: -100 };

    const smoothFollow = () => {
      const target = posRef.current;

      ringPos.x += (target.x - ringPos.x) * 0.14;
      ringPos.y += (target.y - ringPos.y) * 0.14;

      trailPos.x += (target.x - trailPos.x) * 0.07;
      trailPos.y += (target.y - trailPos.y) * 0.07;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.x - 20}px, ${ringPos.y - 20}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.x - 30}px, ${trailPos.y - 30}px)`;
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
      gsap.to([dotRef.current, ringRef.current, trailRef.current], {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    gsap.set(dotRef.current, {
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const handleMouseDown = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 0.7,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 2,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(trailRef.current, {
      scale: 0.5,
      opacity: 0.06,
      duration: 0.25,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
    gsap.to(dotRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)",
    });
    gsap.to(trailRef.current, {
      scale: 1,
      opacity: 0.03,
      duration: 0.5,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    visibleRef.current = false;
    gsap.to([dotRef.current, ringRef.current, trailRef.current], {
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });
  }, []);

  const handleMouseEnterLink = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 2.2,
      borderColor: "rgba(245, 245, 245, 0.35)",
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 0,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(trailRef.current, {
      scale: 1.6,
      opacity: 0.05,
      duration: 0.45,
    });
  }, []);

  const handleMouseLeaveLink = useCallback(() => {
    gsap.to(ringRef.current, {
      scale: 1,
      borderColor: "rgba(245, 245, 245, 0.15)",
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(dotRef.current, {
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
    });
    gsap.to(trailRef.current, {
      scale: 1,
      opacity: 0.03,
      duration: 0.45,
    });
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
        className="fixed top-0 left-0 w-[60px] h-[60px] rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{
          opacity: 0,
          background: "radial-gradient(circle, rgba(245,245,245,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Small center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-foreground pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
        style={{
          opacity: 0,
          border: "1.5px solid rgba(245, 245, 245, 0.15)",
          willChange: "transform",
        }}
      />
    </>
  );
}
