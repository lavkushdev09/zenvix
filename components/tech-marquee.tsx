"use client";

import { useEffect, useRef, useCallback } from "react";
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
  const labelRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);
  const marquee1Ref = useRef<gsap.core.Tween | null>(null);
  const marquee2Ref = useRef<gsap.core.Tween | null>(null);

  const row1 = [...technologies, ...technologies, ...technologies];
  const row2 = [...technologies, ...technologies, ...technologies];

  const setupMarquee = useCallback(() => {
    if (!track1Ref.current || !track2Ref.current) return;

    const cards1 = track1Ref.current.querySelectorAll(".tech-item");
    if (cards1.length === 0) return;

    let setWidth = 0;
    for (let i = 0; i < technologies.length; i++) {
      const card = cards1[i] as HTMLElement;
      if (card) setWidth += card.offsetWidth + 24;
    }

    if (marquee1Ref.current) marquee1Ref.current.kill();
    if (marquee2Ref.current) marquee2Ref.current.kill();

    marquee1Ref.current = gsap.to(track1Ref.current, {
      x: -setWidth,
      duration: 35,
      repeat: -1,
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize((x: number) => parseFloat(String(x)) % setWidth),
      },
    });

    gsap.set(track2Ref.current, { x: -setWidth });
    marquee2Ref.current = gsap.to(track2Ref.current, {
      x: 0,
      duration: 40,
      repeat: -1,
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          const val = parseFloat(String(x)) % setWidth;
          return val > 0 ? val - setWidth : val;
        }),
      },
    });
  }, [technologies.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      setupMarquee();
    }, sectionRef);

    return () => {
      ctx.revert();
      if (marquee1Ref.current) marquee1Ref.current.kill();
      if (marquee2Ref.current) marquee2Ref.current.kill();
    };
  }, [setupMarquee]);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 overflow-hidden border-t border-border"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={labelRef} className="mb-16 opacity-0">
          <SectionHeading
            subtitle="Our Stack"
            title="Technologies We Work With"
            description="We leverage cutting-edge tools and frameworks to build robust, scalable solutions for every challenge."
            align="center"
          />
        </div>
      </div>

      {/* Row 1 */}
      <div className="relative mb-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-40 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-40 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div ref={track1Ref} className="flex items-center gap-6 w-max">
          {row1.map((tech, i) => (
            <TechItem key={`r1-${tech.name}-${i}`} tech={tech} />
          ))}
        </div>
      </div>

      {/* Row 2 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 lg:w-40 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 lg:w-40 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div ref={track2Ref} className="flex items-center gap-6 w-max">
          {row2.map((tech, i) => (
            <TechItem key={`r2-${tech.name}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TechItem({ tech }: { tech: Technology }) {
  return (
    <div className="tech-item flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl border border-border bg-card hover:border-foreground/20 hover:bg-secondary transition-all duration-300 cursor-default group">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary border border-border flex-shrink-0 group-hover:border-foreground/20 transition-colors duration-300">
        <Image
          src={tech.icon}
          alt={tech.name}
          fill
          className="object-contain p-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300 whitespace-nowrap tracking-wide">
        {tech.name}
      </span>
    </div>
  );
}
