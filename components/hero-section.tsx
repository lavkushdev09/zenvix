"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  hero: {
    headline: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}

export function HeroSection({ hero }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const words = hero.headline.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.2,
      });

      // Badge fade in
      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Words stagger reveal
      tl.fromTo(
        wordsRef.current.filter(Boolean),
        { y: 100, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.06,
        },
        "-=0.3"
      );

      // Description
      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      );

      // CTAs
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.4"
      );

      // Bottom line
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power2.inOut" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center grain"
    >
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-16">
        {/* Badge */}
        <div ref={badgeRef} className="mb-8" style={{ opacity: 0 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs tracking-widest uppercase text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            Digital Solutions Studio
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight leading-[0.95] text-foreground"
            style={{ perspective: "1000px" }}>
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
              <span
                ref={(el) => { wordsRef.current[i] = el; }}
                className="inline-block"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="mt-8 text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-2xl"
          style={{ opacity: 0 }}
        >
          {hero.description}
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-wrap items-center gap-4"
          style={{ opacity: 0 }}
        >
          <Link
            href={hero.primaryCta.href}
            className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-foreground text-background font-medium text-sm tracking-wide hover:gap-5 transition-all duration-300"
          >
            {hero.primaryCta.label}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-foreground font-medium text-sm tracking-wide hover:bg-foreground/5 transition-colors duration-300"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12">
        <div
          ref={lineRef}
          className="h-px bg-border origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
