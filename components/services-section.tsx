"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Cloud, Cpu, Palette, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
}

const serviceData: Record<
  string,
  { icon: React.ReactNode; number: string; tags: string[] }
> = {
  "Web Development": {
    icon: <Code2 className="w-6 h-6" />,
    number: "01",
    tags: ["React", "Next.js", "TypeScript", "Node.js"],
  },
  "Cloud & DevOps": {
    icon: <Cloud className="w-6 h-6" />,
    number: "02",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  "AI & Automation": {
    icon: <Cpu className="w-6 h-6" />,
    number: "03",
    tags: ["Python", "NLP", "ML Pipelines", "LLMs"],
  },
  "UI/UX Design": {
    icon: <Palette className="w-6 h-6" />,
    number: "04",
    tags: ["Figma", "Prototyping", "Research", "Design Systems"],
  },
};

export function ServicesSection({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0, scale: 0.97 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: i * 0.12,
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
      className="py-24 lg:py-32 border-t border-border"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeading subtitle="What We Do" title="Services" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, i) => {
            const data = serviceData[service.title] || {
              icon: <Code2 className="w-6 h-6" />,
              number: String(i + 1).padStart(2, "0"),
              tags: [],
            };

            return (
              <div
                key={service.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:border-foreground/20"
                style={{ opacity: 0 }}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] via-transparent to-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="relative p-8 lg:p-10">
                  {/* Top row: number + icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono text-muted-foreground/50 tracking-widest">
                      {data.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl border border-border bg-background flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all duration-500">
                      {data.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-3 flex items-center gap-3">
                    {service.title}
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500" />
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                    {service.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/20 group-hover:text-foreground/70 transition-all duration-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
