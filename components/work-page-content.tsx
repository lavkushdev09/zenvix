"use client";

import { useEffect, useRef, useState } from "react";
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

interface WorkPageContentProps {
  projects: Project[];
}

export function WorkPageContent({ projects }: WorkPageContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))),
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const stats = [
    { value: `${projects.length}+`, label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "5+", label: "Industries Served" },
    { value: "2024", label: "Founded" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      if (heroRef.current) {
        const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } });
        tl.fromTo(
          heroRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        );

        // Stats stagger
        tl.fromTo(
          statsRef.current.filter(Boolean),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        );

        // Filter bar
        if (filterRef.current) {
          tl.fromTo(
            filterRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.3"
          );
        }
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Animate cards on filter change or scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: i * 0.1,
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <section ref={sectionRef} className="min-h-screen">
      {/* Hero area */}
      <div className="pt-32 pb-16 border-b border-border">
        <div
          ref={heroRef}
          className="max-w-[1400px] mx-auto px-6 lg:px-12"
          style={{ opacity: 0 }}
        >
          <SectionHeading
            subtitle="Our Portfolio"
            title="Work That Speaks for Itself"
            description="A curated selection of projects across industries. Every project reflects our commitment to engineering excellence and exceptional design."
          />

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                ref={(el) => {
                  statsRef.current[i] = el;
                }}
                className="p-6 rounded-xl border border-border bg-card"
                style={{ opacity: 0 }}
              >
                <p className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-muted-foreground tracking-wider uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter + grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        {/* Category filter */}
        <div
          ref={filterRef}
          className="flex flex-wrap items-center gap-2 mb-12"
          style={{ opacity: 0 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
