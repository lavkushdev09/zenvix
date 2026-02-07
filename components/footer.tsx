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

export function Footer({ companyName, copyright, links }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.fromTo(
            contentRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
          );
        },
        once: true,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-border">
      <div
        ref={contentRef}
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12"
        style={{ opacity: 0 }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="font-display text-lg font-bold text-foreground tracking-tight">
                {companyName}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">
              {currentYear} {copyright}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
