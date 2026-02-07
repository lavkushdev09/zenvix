"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "./project-card";
import { SectionHeading } from "./section-heading";

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
  const lineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: lineRef.current,
        start: "top 85%",
        onEnter: () => {
          gsap.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
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
        <SectionHeading
          subtitle="Selected Work"
          title={sectionTitle}
          description={`${sectionDescription} (${String(projects.length).padStart(2, "0")} projects)`}
        />
        <div
          ref={lineRef}
          className="h-px bg-border origin-left -mt-8 mb-8"
          style={{ transform: "scaleX(0)" }}
        />

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
