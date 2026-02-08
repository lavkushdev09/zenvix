"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Mail } from "lucide-react";
import { DirectionalFillButton } from "./directional-fill-button";

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  contact: {
    headline: string;
    description: string;
    email: string;
    cta: { label: string; href: string };
  };
}

export function ContactSection({ contact }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
          );
          tl.fromTo(
            headlineRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            "-=0.4"
          );
          tl.fromTo(
            descRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4"
          );
          tl.fromTo(
            ctaRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.3"
          );
          if (statsRef.current) {
            tl.fromTo(
              statsRef.current.children,
              { y: 30, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
              },
              "-=0.3"
            );
          }
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden py-20 lg:py-28"
    >
      {/* Monochromatic perspective grid floor */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        {/* Subtle white glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] blur-[120px] bg-foreground"
        />
        <div
          className="w-[250%] h-[80%] origin-bottom animate-floor"
          style={{
            background: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "3rem 3rem",
            transform: "perspective(400px) rotateX(55deg)",
            maskImage: "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top line */}
        <div
          ref={lineRef}
          className="h-px bg-border origin-left mb-12"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          {/* Left content */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs tracking-widest uppercase text-muted-foreground mb-8">
              <Mail className="w-3.5 h-3.5" />
              Get in touch
            </span>

            <h2
              ref={headlineRef}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05] text-balance"
              style={{ opacity: 0 }}
            >
              {contact.headline}
            </h2>

            <p
              ref={descRef}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl"
              style={{ opacity: 0 }}
            >
              {contact.description}
            </p>

            <div
              ref={ctaRef}
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
              style={{ opacity: 0 }}
            >
              <DirectionalFillButton
                variant="primary"
                size="lg"
                href={contact.cta.href}
              >
                {contact.cta.label}
                <ArrowRight className="w-4 h-4" />
              </DirectionalFillButton>
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
              >
                <span className="w-8 h-px bg-border group-hover:bg-foreground group-hover:w-12 transition-all duration-300" />
                {contact.email}
              </a>
            </div>
          </div>

          {/* Right stats */}
          <div ref={statsRef} className="flex flex-row lg:flex-col gap-8 lg:gap-10">
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24h", label: "Response Time" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group"
                style={{ opacity: 0 }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-foreground font-display tracking-tight group-hover:tracking-wide transition-all duration-500">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
