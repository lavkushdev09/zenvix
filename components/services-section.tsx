"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Cloud, Cpu, Palette, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./section-heading";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
}

const serviceData: Record<
  string,
  { icon: React.ReactNode; number: string; tags: string[]; href: string }
> = {
  "Web Development": {
    icon: <Code2 className="w-7 h-7" />,
    number: "01",
    tags: ["React", "Next.js", "TypeScript", "Node.js"],
    href: "/services#web-development",
  },
  "Cloud & DevOps": {
    icon: <Cloud className="w-7 h-7" />,
    number: "02",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    href: "/services#cloud-devops",
  },
  "AI & Automation": {
    icon: <Cpu className="w-7 h-7" />,
    number: "03",
    tags: ["Python", "NLP", "ML Pipelines", "LLMs"],
    href: "/services#ai-automation",
  },
  "UI/UX Design": {
    icon: <Palette className="w-7 h-7" />,
    number: "04",
    tags: ["Figma", "Prototyping", "Research", "Design Systems"],
    href: "/services#ui-ux-design",
  },
};

export function ServicesSection({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const marqueeAnimation = useRef<gsap.core.Tween | null>(null);

  const items = [...services, ...services, ...services];

  const setupMarquee = useCallback(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const cards = track.querySelectorAll(".service-marquee-card");
    if (cards.length === 0) return;

    let totalWidth = 0;
    const originalCount = services.length;
    for (let i = 0; i < originalCount; i++) {
      const card = cards[i] as HTMLElement;
      totalWidth += card.offsetWidth + 20;
    }

    if (marqueeAnimation.current) {
      marqueeAnimation.current.kill();
    }

    marqueeAnimation.current = gsap.to(track, {
      x: -totalWidth,
      duration: 25,
      repeat: -1,
      ease: "none",
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          return parseFloat(String(x)) % totalWidth;
        }),
      },
    });
  }, [services.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          setupMarquee();
        },
      });

      setupMarquee();
    }, sectionRef);

    return () => {
      ctx.revert();
      if (marqueeAnimation.current) {
        marqueeAnimation.current.kill();
      }
    };
  }, [setupMarquee]);

  const handleMouseEnter = () => {
    if (marqueeAnimation.current) {
      gsap.to(marqueeAnimation.current, { timeScale: 0, duration: 0.6, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    if (marqueeAnimation.current) {
      gsap.to(marqueeAnimation.current, { timeScale: 1, duration: 0.6, ease: "power2.out" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-24 lg:py-32 border-t border-border overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-14">
        <SectionHeading subtitle="What We Do" title="Services" />
      </div>

      {/* Marquee track */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

        <div
          ref={trackRef}
          className="flex items-stretch gap-5 w-max px-8"
        >
          {items.map((service, i) => {
            const data = serviceData[service.title] || {
              icon: <Code2 className="w-7 h-7" />,
              number: String((i % services.length) + 1).padStart(2, "0"),
              tags: [],
              href: "/services",
            };

            return (
              <Link
                key={`${service.title}-${i}`}
                href={data.href}
                className="service-marquee-card group relative flex-shrink-0 w-[340px] sm:w-[400px] rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-foreground/20 block"
              >
                {/* Hover glow - monochromatic */}
                <div className="absolute inset-0 bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono text-muted-foreground/40 tracking-widest">
                      {data.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-all duration-500">
                      {data.icon}
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-foreground mb-3 flex items-center gap-3">
                    {service.title}
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/15 group-hover:text-foreground/70 transition-all duration-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line - monochromatic */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
