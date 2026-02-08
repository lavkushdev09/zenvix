"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "./section-heading";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

function AnimatedWorkCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(contentRef.current, {
      y: -6,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.to(arrowRef.current, {
      rotate: 45,
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out",
    });
    // Shine sweep effect
    gsap.fromTo(
      shineRef.current,
      { x: "-100%", opacity: 0.15 },
      { x: "200%", opacity: 0, duration: 0.8, ease: "power2.inOut" }
    );
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(contentRef.current, {
      y: 0,
      duration: 0.5,
      ease: "power3.out",
    });
    gsap.to(arrowRef.current, {
      rotate: 0,
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block relative rounded-2xl overflow-hidden border border-border bg-card transition-all duration-700 hover:border-foreground/20 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.06)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} project`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        {/* Hover overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-background/30 backdrop-blur-[2px] opacity-0"
        />
        {/* Shine sweep */}
        <div
          ref={shineRef}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent pointer-events-none"
          style={{ transform: "translateX(-100%)" }}
        />
        {/* Number badge */}
        <div className="absolute top-5 left-5 z-10">
          <span className="text-xs font-mono text-foreground/70 bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-foreground/10">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {/* Category badge */}
        <div className="absolute top-5 right-5 z-10">
          <span className="text-[10px] tracking-widest uppercase text-foreground/60 bg-background/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-foreground/10">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6 lg:p-7">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground font-mono">{project.year}</span>
          <span className="w-4 h-px bg-border" />
          <span className="text-xs text-muted-foreground tracking-wider uppercase">{project.category}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground tracking-tight group-hover:text-foreground/80 transition-colors duration-500">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.shortDescription}
            </p>
          </div>
          <div
            ref={arrowRef}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 group-hover:text-foreground group-hover:border-foreground/30 transition-colors duration-500"
          >
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        {/* Tech stack */}
        <div className="mt-5 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/15 group-hover:text-foreground/60 transition-all duration-500"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/15 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </Link>
  );
}

export function WorkPageContent({ projects }: WorkPageContentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
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
      if (heroRef.current) {
        const tl = gsap.timeline({
          delay: 0.2,
          defaults: { ease: "power4.out" },
        });
        tl.fromTo(
          heroRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        );

        tl.fromTo(
          statsRef.current.filter(Boolean),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        );

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

  // Animate cards on filter change with staggered entrance
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll(".work-card-item");
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
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
                className="group p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-500"
                style={{ opacity: 0 }}
              >
                <p className="font-display text-3xl lg:text-4xl font-bold text-foreground group-hover:tracking-wide transition-all duration-500">
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

      {/* Filter + Grid */}
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

        {/* Masonry-style grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project, i) => (
            <div
              key={project.slug}
              className="work-card-item"
              style={{ opacity: 0 }}
            >
              <AnimatedWorkCard project={project} index={i} />
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
