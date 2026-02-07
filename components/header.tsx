"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import { DirectionalFillButton } from "./directional-fill-button";

interface HeaderProps {
  companyName: string;
  navigation: { label: string; href: string }[];
}

export function Header({ companyName, navigation }: HeaderProps) {
  const pathname = usePathname();
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

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  }

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
        {/* Logo -- left */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <span className="font-display text-lg font-bold text-foreground tracking-tight">
            {companyName}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300" />
        </Link>

        {/* Desktop nav -- center */}
        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm transition-colors duration-300 ${
                    active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-foreground" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA -- right */}
        <div className="hidden md:block flex-shrink-0">
          <DirectionalFillButton variant="primary" href="/contact">
            Get In Touch
          </DirectionalFillButton>
        </div>

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
          <ul className="px-6 py-6 flex flex-col gap-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`block text-2xl font-display font-semibold py-2 transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-4">
              <DirectionalFillButton
                variant="primary"
                href="/contact"
                onClick={() => setIsMobileOpen(false)}
              >
                Get In Touch
              </DirectionalFillButton>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
