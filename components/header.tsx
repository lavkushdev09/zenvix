"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  companyName: string;
  navigation: { label: string; href: string }[];
}

export function Header({ companyName, navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Entrance animation
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  useEffect(() => {
    if (isMobileOpen && mobileMenuRef.current) {
      const items = mobileMenuRef.current.querySelectorAll("li");
      gsap.fromTo(
        items,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: "power3.out" }
      );
    }
  }, [isMobileOpen]);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
      style={{ opacity: 0 }}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            {companyName}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-4">
            <Link
              href="/#contact"
              className="inline-flex items-center px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors duration-300"
            >
              Get In Touch
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-foreground"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        >
          {isMobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <ul className="px-6 py-6 space-y-1">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block text-2xl font-display font-semibold text-foreground py-2 hover:text-muted-foreground transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/#contact"
                className="inline-flex items-center px-6 py-3 rounded-full bg-foreground text-background text-sm font-medium"
                onClick={() => setIsMobileOpen(false)}
              >
                Get In Touch
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
