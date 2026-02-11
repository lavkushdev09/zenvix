"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DirectionalFillButton } from "./directional-fill-button";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  thumbnail: string;
  overview: string;
  challenge: string;
  solution: string;
  gallery: string[];
  year: string;
  client: string;
  category: string;
}

interface Props {
  project: Project;
  contactCta: { label: string; href: string };
}

export function ProjectPageClient({ project, contactCta }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.2 });

      heroTl.fromTo(
        heroRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      heroTl.fromTo(
        imageRef.current,
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1 },
        "-=0.4"
      );

      if (imageRef.current) {
        gsap.to(imageRef.current?.querySelector("img"), {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      sectionsRef.current.filter(Boolean).forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(
              section,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
            );
          },
          once: true,
        });
      });

      if (galleryRef.current) {
        const galleryItems = galleryRef.current.children;
        ScrollTrigger.create({
          trigger: galleryRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo(
              galleryItems,
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
              }
            );
          },
          once: true,
        });
      }

      if (ctaRef.current) {
        ScrollTrigger.create({
          trigger: ctaRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              ctaRef.current,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
            );
          },
          once: true,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24">
      {/* Back link */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12 mb-8 sm:mb-12">
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <div
        ref={heroRef}
        className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <span className="px-3 py-1 rounded-full border border-border text-xs tracking-wider uppercase text-muted-foreground">
            {project.category}
          </span>
          <span className="text-xs text-muted-foreground">{project.year}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">{project.client}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
          {project.title}
        </h1>
        <p className="mt-5 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl">
          {project.shortDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-block px-3 py-1.5 text-xs rounded-full border border-border text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hero image */}
      <div
        ref={imageRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-14"
        style={{ opacity: 0 }}
      >
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border">
          <Image
            src={project.thumbnail || "/placeholder.svg"}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-16">
            <section
              ref={(el) => { sectionsRef.current[0] = el; }}
              style={{ opacity: 0 }}
            >
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                01 -- Overview
              </span>
              <h2 className="mt-3 font-display text-2xl lg:text-3xl font-semibold text-foreground">
                About the project
              </h2>
              <p className="mt-4 text-muted-foreground leading-[1.8]">
                {project.overview}
              </p>
            </section>

            <section
              ref={(el) => { sectionsRef.current[1] = el; }}
              style={{ opacity: 0 }}
            >
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                02 -- Challenge
              </span>
              <h2 className="mt-3 font-display text-2xl lg:text-3xl font-semibold text-foreground">
                The problem
              </h2>
              <p className="mt-4 text-muted-foreground leading-[1.8]">
                {project.challenge}
              </p>
            </section>

            <section
              ref={(el) => { sectionsRef.current[2] = el; }}
              style={{ opacity: 0 }}
            >
              <span className="text-xs tracking-widest uppercase text-muted-foreground">
                03 -- Solution
              </span>
              <h2 className="mt-3 font-display text-2xl lg:text-3xl font-semibold text-foreground">
                Our approach
              </h2>
              <p className="mt-4 text-muted-foreground leading-[1.8]">
                {project.solution}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="rounded-xl border border-border bg-card p-8">
                <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-6">
                  Project Details
                </h3>
                <dl className="space-y-5">
                  <div className="flex justify-between items-baseline">
                    <dt className="text-sm text-muted-foreground">Client</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {project.client}
                    </dd>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-baseline">
                    <dt className="text-sm text-muted-foreground">Year</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {project.year}
                    </dd>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-baseline">
                    <dt className="text-sm text-muted-foreground">Category</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {project.category}
                    </dd>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <dt className="text-sm text-muted-foreground mb-3">
                      Technology
                    </dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-block px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 1 && (
        <div
          ref={galleryRef}
          className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {project.gallery.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[16/10] rounded-xl overflow-hidden bg-card border border-border"
              style={{ opacity: 0 }}
            >
              <Image
                src={img || "/placeholder.svg"}
                alt={`${project.title} gallery image ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        ref={ctaRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-24"
        style={{ opacity: 0 }}
      >
        <div className="border-t border-border pt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
              Interested in working together?
            </h3>
            <p className="mt-2 text-muted-foreground">
              {"Let's discuss your next project."}
            </p>
          </div>
          <DirectionalFillButton variant="primary" href={contactCta.href}>
            {contactCta.label}
            <ArrowRight className="w-4 h-4" />
          </DirectionalFillButton>
        </div>
      </div>
    </div>
  );
}
