"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Technology {
  name: string;
  icon: string;
}

export function TechMarquee({ technologies }: { technologies: Technology[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const items = [...technologies, ...technologies, ...technologies];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            labelRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
          );
        },
        once: true,
      });

      // Continuous marquee
      if (track1Ref.current) {
        gsap.to(track1Ref.current, {
          xPercent: -33.333,
          duration: 40,
          repeat: -1,
          ease: "none",
        });
      }
      if (track2Ref.current) {
        gsap.fromTo(
          track2Ref.current,
          { xPercent: -33.333 },
          {
            xPercent: 0,
            duration: 40,
            repeat: -1,
            ease: "none",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 overflow-hidden">
      {/* Label */}
      <div
        ref={labelRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12"
        style={{ opacity: 0 }}
      >
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          Technologies We Work With
        </span>
      </div>

      {/* Track 1 - left to right */}
      <div className="mb-4 overflow-hidden">
        <div ref={track1Ref} className="flex items-center gap-4 w-max">
          {items.map((tech, i) => (
            <div
              key={`t1-${i}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-border bg-card whitespace-nowrap hover:bg-accent hover:border-foreground/20 transition-colors duration-300"
            >
              <span className="text-sm font-medium text-foreground">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Track 2 - right to left */}
      <div className="overflow-hidden">
        <div ref={track2Ref} className="flex items-center gap-4 w-max">
          {[...items].reverse().map((tech, i) => (
            <div
              key={`t2-${i}`}
              className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-border bg-card whitespace-nowrap hover:bg-accent hover:border-foreground/20 transition-colors duration-300"
            >
              <span className="text-sm font-medium text-foreground">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
