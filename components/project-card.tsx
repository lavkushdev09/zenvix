"use client";

import { useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  thumbnail: string;
  year?: string;
  category?: string;
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!imageRef.current || !arrowRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.7,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, {
      rotate: 45,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current || !arrowRef.current) return;
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
    });
    gsap.to(arrowRef.current, {
      rotate: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <Link
      ref={cardRef}
      href={`/work/${project.slug}`}
      className="group block rounded-xl border border-border bg-card p-4 transition-all duration-500 hover:border-foreground/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-background">
        <div ref={imageRef} className="absolute inset-0">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} project`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs font-mono text-foreground/60 bg-background/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-foreground/10">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {project.category && (
              <span className="text-xs tracking-wider uppercase text-muted-foreground">
                {project.category}
              </span>
            )}
            {project.year && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="text-xs text-muted-foreground">
                  {project.year}
                </span>
              </>
            )}
          </div>
          <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground group-hover:text-muted-foreground transition-colors duration-300">
            {project.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="inline-block px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground group-hover:border-foreground/15 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 3 && (
              <span className="inline-block px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground">
                +{project.techStack.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div
          ref={arrowRef}
          className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground transition-colors duration-300"
        >
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
