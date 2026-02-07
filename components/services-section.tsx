"use client";

import React from "react"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, Cloud, Cpu, Palette } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  title: string;
  description: string;
}

const serviceIcons: Record<string, React.ReactNode> = {
  "Web Development": <Code2 className="w-5 h-5" />,
  "Cloud & DevOps": <Cloud className="w-5 h-5" />,
  "AI & Automation": <Cpu className="w-5 h-5" />,
  "UI/UX Design": <Palette className="w-5 h-5" />,
};

export function ServicesSection({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            headerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
          );
        },
        once: true,
      });

      itemsRef.current.filter(Boolean).forEach((item, i) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              item,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
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
    <section ref={sectionRef} id="services" className="py-24 lg:py-32 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headerRef} className="mb-16" style={{ opacity: 0 }}>
          <span className="text-xs tracking-widest uppercase text-muted-foreground">
            What We Do
          </span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Services
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
          {services.map((service, i) => (
            <div
              key={service.title}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="bg-background p-8 lg:p-10 group hover:bg-card transition-colors duration-500"
              style={{ opacity: 0 }}
            >
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all duration-300 mb-6">
                {serviceIcons[service.title] || (
                  <Code2 className="w-5 h-5" />
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
