"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "./project-card";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  thumbnail: string;
  year: string;
  category: string;
}

interface WorkSectionProps {
  sectionTitle: string;
  sectionDescription: string;
  projects: Project[];
}

export function WorkSection({
  sectionTitle,
  sectionDescription,
  projects,
}: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 80%",
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            headerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }
          );
          tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
            "-=0.3"
          );
        },
        once: true,
      });

      // Card stagger reveals
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                delay: i % 2 === 0 ? 0 : 0.15,
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
    <section ref={sectionRef} id="work" className="py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div ref={headerRef} style={{ opacity: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-4">
            <div>
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                Selected Work
              </span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                {sectionTitle}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-lg text-base lg:text-right">
              {sectionDescription}
              <span
                ref={countRef}
                className="ml-2 text-foreground font-medium"
              >
                ({String(projects.length).padStart(2, "0")} projects)
              </span>
            </p>
          </div>
          <div
            ref={lineRef}
            className="h-px bg-border origin-left mt-8"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Project grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => { cardsRef.current[i] = el; }}
              style={{ opacity: 0 }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
