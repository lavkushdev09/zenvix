"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

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
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
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
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="py-32 lg:py-44">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Top line */}
        <div
          ref={lineRef}
          className="h-px bg-border origin-left mb-16"
          style={{ transform: "scaleX(0)" }}
        />

        <div className="max-w-3xl">
          <h2
            ref={headlineRef}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]"
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
            <a
              href={contact.cta.href}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-foreground text-background font-medium text-sm tracking-wide hover:gap-5 transition-all duration-300"
            >
              {contact.cta.label}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
