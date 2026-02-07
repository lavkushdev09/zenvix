"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { SectionHeading } from "./section-heading";

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

  // repeat list for smooth infinite scroll
  const items = [...technologies, ...technologies, ...technologies];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            labelRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
          );
        },
      });

      // Marquee animations
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
      {/* Heading */}
      <div
        ref={labelRef}
        className="mx-auto mb-12 max-w-[1400px] px-6 lg:px-12 opacity-0"
      >
        <SectionHeading
          subtitle="Our Stack"
          title="Technologies We Work With"
          description="We leverage cutting-edge tools and frameworks to build robust, scalable solutions for every challenge."
          align="center"
        />
      </div>

      {/* Track 1 */}
      <div className="mb-4 overflow-hidden">
        <div ref={track1Ref} className="flex w-max items-center gap-4">
          {items.map((tech, i) => (
            <TechPill key={`t1-${i}`} tech={tech} />
          ))}
        </div>
      </div>

      {/* Track 2 */}
      <div className="overflow-hidden">
        <div ref={track2Ref} className="flex w-max items-center gap-4">
          {[...items].reverse().map((tech, i) => (
            <TechPill key={`t2-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- */
/* Tech Pill */
/* ---------------------------- */

function TechPill({ tech }: { tech: Technology }) {
  return (
    <div className="group flex items-center gap-3 rounded-full border border-border bg-card px-6 py-3.5 whitespace-nowrap transition-all duration-300 hover:bg-accent hover:border-foreground/20">
      <div className="relative h-5 w-5">
        <Image
          src={tech.icon}
          alt={tech.name}
          fill
          className="object-contain opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
        />
      </div>

      <span className="text-sm font-medium text-foreground">
        {tech.name}
      </span>
    </div>
  );
}
