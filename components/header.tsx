"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  companyName: string;
  navigation: { label: string; href: string }[];
}

export function Header({ companyName, navigation }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pillRef.current) {
      gsap.fromTo(
        pillRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
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
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <div
        ref={pillRef}
        className={`relative w-full max-w-[900px] transition-all duration-500 ${isScrolled ? "max-w-[860px]" : "max-w-[900px]"
          }`}
        style={{ opacity: 0 }}
      >
        <nav className="relative flex items-center justify-between rounded-full border border-border bg-background/90 backdrop-blur-xl px-3 py-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 pl-3 flex-shrink-0 group"
          >
            <Image
              src="/mix.png"
              width={70}
              height={70}
              preload={true}
              alt="Picture of the author"
            />
            {/* <span className="font-display text-base font-bold text-foreground tracking-tight group-hover:text-muted-foreground transition-colors duration-300">
              {companyName}
            </span> */}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 text-sm transition-colors duration-300 rounded-full ${active
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden md:block flex-shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-2 rounded-full bg-foreground text-background text-sm font-semibold transition-all duration-300 hover:bg-foreground/85 hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]"
            >
              Chat With Us
            </Link>
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
            className="md:hidden mt-2 rounded-2xl bg-background/95 backdrop-blur-xl border border-border overflow-hidden"
          >
            <ul className="px-6 py-6 flex flex-col gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`block text-lg font-display font-semibold py-2 transition-colors ${active
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
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Chat With Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
