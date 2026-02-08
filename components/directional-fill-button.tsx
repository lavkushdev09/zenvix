"use client";

import React, { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

type Direction =
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left"
  | "top-left";

interface DirectionalFillButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  href?: string;
}

function getEntryDirection(e: React.MouseEvent, rect: DOMRect): Direction {
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const angle = Math.atan2(y, x) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) return "right";
  if (angle >= 22.5 && angle < 67.5) return "bottom-right";
  if (angle >= 67.5 && angle < 112.5) return "bottom";
  if (angle >= 112.5 && angle < 157.5) return "bottom-left";
  if (angle >= -67.5 && angle < -22.5) return "top-right";
  if (angle >= -112.5 && angle < -67.5) return "top";
  if (angle >= -157.5 && angle < -112.5) return "top-left";
  return "left";
}

function getOffset(direction: Direction) {
  switch (direction) {
    case "top":
      return { x: "0%", y: "-110%" };
    case "top-right":
      return { x: "110%", y: "-110%" };
    case "right":
      return { x: "110%", y: "0%" };
    case "bottom-right":
      return { x: "110%", y: "110%" };
    case "bottom":
      return { x: "0%", y: "110%" };
    case "bottom-left":
      return { x: "-110%", y: "110%" };
    case "left":
      return { x: "-110%", y: "0%" };
    case "top-left":
      return { x: "-110%", y: "-110%" };
  }
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
    const direction = getEntryDirection(e, rect);
    const offset = getOffset(direction);

    setIsHovered(true);
    gsap.killTweensOf(fillRef.current);
    gsap.set(fillRef.current, { x: offset.x, y: offset.y });
    gsap.to(fillRef.current, {
      x: "0%",
      y: "0%",
      duration: 0.5,
      ease: "power3.out",
    });

    // Subtle text lift
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    if (!btnRef.current || !fillRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const direction = getEntryDirection(e, rect);
    const offset = getOffset(direction);

    setIsHovered(false);
    gsap.killTweensOf(fillRef.current);
    gsap.to(fillRef.current, {
      x: offset.x,
      y: offset.y,
      duration: 0.45,
      ease: "power3.in",
    });

    if (textRef.current) {
      gsap.to(textRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

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
    "absolute inset-0 pointer-events-none",
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
        style={{ transform: "translateX(-110%) translateY(0%)" }}
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
