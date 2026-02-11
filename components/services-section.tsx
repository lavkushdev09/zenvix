"use client";

import React, { useEffect, useRef } from "react";
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
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: i * 0.1,
              }
            );
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-16 sm:py-24 lg:py-32 border-t border-border"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
        <SectionHeading
          subtitle="What We Do"
          title="Services"
          description="We deliver end-to-end digital solutions across four core disciplines."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {services.map((service, i) => {
            const data = serviceData[service.title] || {
              icon: <Code2 className="w-7 h-7" />,
              number: String(i + 1).padStart(2, "0"),
              tags: [],
              href: "/services",
            };

            return (
              <Link
                key={service.title}
                href={data.href}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-foreground/20 block"
                style={{ opacity: 0 }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                {/* Hover glow */}
                <div className="absolute inset-0 bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative p-5 sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/40 tracking-widest">
                      {data.number}
                    </span>
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-all duration-500">
                      {data.icon}
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                    {service.title}
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 flex-shrink-0" />
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-md">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/15 group-hover:text-foreground/70 transition-all duration-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
