"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  companyName: string;
  copyright: string;
  links: { label: string; href: string }[];
}

export function Footer({ companyName, copyright }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 92%",
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.inOut" }
          );
          tl.fromTo(
            contentRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            "-=0.4"
          );
        },
        once: true,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative">
      {/* Animated separator line */}
      <div className="px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div
          ref={lineRef}
          className="h-px bg-border origin-center"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div
        ref={contentRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20"
        style={{ opacity: 0 }}
      >
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          {/* Brand side */}
          <div className="flex-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-foreground"
              >
                <path
                  d="M4 7h3l2-3h6l2 3h3a1 1 0 011 1v4a1 1 0 01-1 1h-2l-2 3H8l-2-3H4a1 1 0 01-1-1V8a1 1 0 011-1z"
                  fill="currentColor"
                />
                <path
                  d="M7 17v3M12 16v4M17 17v3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="font-display text-xl font-bold text-foreground tracking-tight group-hover:text-muted-foreground transition-colors duration-300">
                {companyName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-sm">
              Crafting high-performance digital products that drive growth and transform businesses.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8" aria-label="Footer navigation">
            {[
              { label: "Home", href: "/" },
              { label: "Work", href: "/work" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            {currentYear} {copyright}
          </p>
          <p className="text-xs text-muted-foreground/40">
            Built with precision and care
          </p>
        </div>
      </div>
    </footer>
  );
}
