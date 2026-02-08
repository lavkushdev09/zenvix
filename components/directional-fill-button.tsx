"use client";

import React, { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface DirectionalFillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  href?: string;
}

export function DirectionalFillButton({
  children,
  variant = "primary",
  size = "default",
  className,
  href,
  ...props
}: DirectionalFillButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current || !fillRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();

    // Get cursor entry position relative to button (as percentage)
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    // Calculate max distance from entry point to any corner (for full coverage)
    const maxDist = Math.max(
      Math.hypot(x, y),
      Math.hypot(rect.width - x, y),
      Math.hypot(x, rect.height - y),
      Math.hypot(rect.width - x, rect.height - y)
    );
    // Convert to percentage of the larger dimension for circle radius
    const maxRadius = (maxDist / Math.max(rect.width, rect.height)) * 150;

    setIsHovered(true);
    gsap.killTweensOf(fillRef.current);

    // Position the fill circle at cursor entry point
    fillRef.current.style.setProperty("--fill-x", `${xPct}%`);
    fillRef.current.style.setProperty("--fill-y", `${yPct}%`);

    // Animate clip-path circle from 0 to full coverage
    gsap.fromTo(
      fillRef.current,
      { clipPath: `circle(0% at ${xPct}% ${yPct}%)` },
      {
        clipPath: `circle(${maxRadius}% at ${xPct}% ${yPct}%)`,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    // Subtle text lift
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      if (!btnRef.current || !fillRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();

      // Get cursor exit position
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width) * 100;
      const yPct = (y / rect.height) * 100;

      setIsHovered(false);
      gsap.killTweensOf(fillRef.current);

      // Get current clip-path to animate from
      const computed = getComputedStyle(fillRef.current).clipPath;

      // Animate circle shrinking toward exit point
      gsap.fromTo(
        fillRef.current,
        { clipPath: computed || `circle(150% at 50% 50%)` },
        {
          clipPath: `circle(0% at ${xPct}% ${yPct}%)`,
          duration: 0.45,
          ease: "power3.in",
        }
      );

      if (textRef.current) {
        gsap.to(textRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    []
  );

  const isPrimary = variant === "primary";

  const baseClasses = cn(
    "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium text-sm tracking-wide",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "transition-shadow duration-500",
    size === "lg" ? "px-8 py-4" : "px-7 py-3",
    isPrimary
      ? "bg-foreground border border-foreground hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]"
      : "bg-transparent border border-border hover:border-foreground/30 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.08)]",
    className
  );

  const fillClasses = cn(
    "absolute inset-0 pointer-events-none rounded-full",
    isPrimary ? "bg-background" : "bg-foreground"
  );

  const textColor = isPrimary
    ? isHovered
      ? "text-foreground"
      : "text-background"
    : isHovered
      ? "text-background"
      : "text-foreground";

  const content = (
    <>
      <span
        ref={fillRef}
        className={fillClasses}
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />
      <span
        ref={textRef}
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-colors duration-300",
          textColor
        )}
      >
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={btnRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={props.onClick as React.MouseEventHandler<HTMLAnchorElement>}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.Ref<HTMLButtonElement>}
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </button>
  );
}
