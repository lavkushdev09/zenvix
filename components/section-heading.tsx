"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 82%",
        onEnter: () => {
          gsap.fromTo(
            containerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mb-10 sm:mb-16 ${align === "center" ? "text-center" : ""}`}
      style={{ opacity: 0 }}
    >
      <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground">
        <span className="inline-block w-6 sm:w-8 h-px bg-muted-foreground/50" />
        {subtitle}
      </span>
      <h2 className="mt-3 sm:mt-4 font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed ${
            align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"
          }`}
        >
          {description}
        </p>
      )}
      <div
        className={`mt-4 sm:mt-6 h-px bg-border ${
          align === "center" ? "w-12 sm:w-16 mx-auto" : "w-12 sm:w-16"
        }`}
      />
    </div>
  );
}
