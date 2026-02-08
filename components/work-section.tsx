"use client";

import { useEffect, useRef } from "react";
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

interface WorkSectionProps {
  sectionTitle: string;
  sectionDescription: string;
  projects: Project[];
}

function FeaturedCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.03, duration: 0.8, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.8, ease: "power2.out" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-card border border-border">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} project`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Hover overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-background/30 backdrop-blur-[2px] opacity-0"
        />
        {/* Number */}
        <div className="absolute top-6 left-6 z-10">
          <span className="font-mono text-sm text-foreground/60 bg-background/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
            01
          </span>
        </div>
        {/* Featured badge */}
        <div className="absolute top-6 right-6 z-10">
          <span className="text-xs tracking-widest uppercase text-foreground/60 bg-background/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border/50">
            Featured
          </span>
        </div>
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="flex items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs tracking-wider uppercase text-muted-foreground">
                  {project.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="text-xs text-muted-foreground">{project.year}</span>
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xl">
                {project.shortDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-xs rounded-full border border-border/50 text-muted-foreground bg-background/40 backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/40 group-hover:text-foreground group-hover:border-foreground/60 transition-all duration-500 group-hover:rotate-45">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, { scale: 1.05, duration: 0.6, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: "power2.out" });
  };

  return (
    <Link
      ref={rowRef}
      href={`/work/${project.slug}`}
      className="group flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 py-8 border-b border-border hover:border-foreground/20 transition-colors duration-500"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Number */}
      <span className="font-mono text-sm text-muted-foreground/40 lg:w-12 flex-shrink-0">
        {String(index).padStart(2, "0")}
      </span>

      {/* Thumbnail */}
      <div className="relative w-full lg:w-48 aspect-[16/10] lg:aspect-[3/2] overflow-hidden rounded-xl bg-card flex-shrink-0">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} project`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 192px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-xs tracking-wider uppercase text-muted-foreground">
            {project.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>
        <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors duration-300 tracking-tight">
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-1 max-w-lg">
          {project.shortDescription}
        </p>
      </div>

      {/* Tech stack */}
      <div className="hidden lg:flex flex-wrap gap-2 flex-shrink-0 max-w-[240px]">
        {project.techStack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/20 transition-colors duration-300"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Arrow */}
      <div className="hidden lg:flex flex-shrink-0 w-10 h-10 rounded-full border border-border items-center justify-center text-muted-foreground/30 group-hover:text-foreground group-hover:border-foreground/30 group-hover:rotate-45 transition-all duration-500">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

export function WorkSection({
  sectionTitle,
  sectionDescription,
  projects,
}: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top line
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

      // Featured card
      ScrollTrigger.create({
        trigger: featuredRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.fromTo(
            featuredRef.current,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
          );
        },
        once: true,
      });

      // Project rows
      if (listRef.current) {
        const rows = listRef.current.children;
        Array.from(rows).forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 88%",
            onEnter: () => {
              gsap.fromTo(
                row,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: "power3.out",
                  delay: i * 0.08,
                }
              );
            },
            once: true,
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featured = projects[0];
  const rest = projects.slice(1);

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
          className="h-px bg-border origin-left -mt-8 mb-12"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Featured project */}
        {featured && (
          <div ref={featuredRef} style={{ opacity: 0 }}>
            <FeaturedCard project={featured} />
          </div>
        )}

        {/* Project list */}
        <div ref={listRef} className="mt-8">
          {rest.map((project, i) => (
            <div key={project.slug} style={{ opacity: 0 }}>
              <ProjectRow project={project} index={i + 2} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
