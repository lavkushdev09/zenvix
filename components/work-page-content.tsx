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

function BentoCard({
  project,
  index,
  size = "normal",
}: {
  project: Project;
  index: number;
  size?: "featured" | "tall" | "normal";
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.06,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
    gsap.to(contentRef.current, { y: -4, duration: 0.4, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
    gsap.to(contentRef.current, { y: 0, duration: 0.4, ease: "power2.out" });
  };

  const aspectClass =
    size === "featured"
      ? "aspect-[16/9]"
      : size === "tall"
        ? "aspect-[3/4]"
        : "aspect-[4/3]";

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block relative rounded-2xl overflow-hidden border border-border bg-card transition-all duration-500 hover:border-foreground/20"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area */}
      <div className={`relative ${aspectClass} overflow-hidden`}>
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} project`}
            fill
            className="object-cover"
            sizes={size === "featured" ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
          />
        </div>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        {/* Hover overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-background/20 backdrop-blur-[1px] opacity-0"
        />
        {/* Number badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs font-mono text-foreground/70 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/40">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        {/* Category badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] tracking-widest uppercase text-foreground/60 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/40">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-display font-bold text-foreground tracking-tight group-hover:text-muted-foreground transition-colors duration-300 ${
                size === "featured"
                  ? "text-2xl lg:text-3xl"
                  : "text-xl lg:text-2xl"
              }`}
            >
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {project.shortDescription}
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 group-hover:text-foreground group-hover:border-foreground/30 group-hover:rotate-45 transition-all duration-500">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/20 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
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

  // Animate cards on filter change
  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll(".bento-card-item");
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeFilter]);

  // Determine bento layout sizes based on position
  const getCardSize = (index: number): "featured" | "tall" | "normal" => {
    if (index === 0) return "featured";
    if (index === 3 || index === 4) return "tall";
    return "normal";
  };

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

      {/* Filter + bento grid */}
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

        {/* Bento Grid Layout */}
        <div ref={gridRef}>
          {filteredProjects.length > 0 && (
            <div className="flex flex-col gap-6 lg:gap-8">
              {/* Row 1: Featured full-width card */}
              <div className="bento-card-item" style={{ opacity: 0 }}>
                <BentoCard
                  project={filteredProjects[0]}
                  index={0}
                  size="featured"
                />
              </div>

              {/* Row 2: Two equal cards */}
              {filteredProjects.length > 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {filteredProjects.slice(1, 3).map((project, i) => (
                    <div
                      key={project.slug}
                      className="bento-card-item"
                      style={{ opacity: 0 }}
                    >
                      <BentoCard project={project} index={i + 1} size="normal" />
                    </div>
                  ))}
                </div>
              )}

              {/* Row 3: Asymmetric - tall left + stacked right */}
              {filteredProjects.length > 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
                  <div
                    className="lg:col-span-2 bento-card-item"
                    style={{ opacity: 0 }}
                  >
                    <BentoCard
                      project={filteredProjects[3]}
                      index={3}
                      size="tall"
                    />
                  </div>
                  <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8">
                    {filteredProjects.slice(4).map((project, i) => (
                      <div
                        key={project.slug}
                        className="bento-card-item"
                        style={{ opacity: 0 }}
                      >
                        <BentoCard
                          project={project}
                          index={i + 4}
                          size="normal"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
