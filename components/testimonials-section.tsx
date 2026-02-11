"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "./section-heading";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSlides = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalSlides - 1));
      setActiveIndex(clamped);

      if (!trackRef.current) return;

      // Each card is 1/totalSlides of the track width, so moving by (clamped / totalSlides * 100)% of the track
      const translatePercent = -(clamped * (100 / totalSlides));
      gsap.to(trackRef.current, {
        x: `${translatePercent}%`,
        duration: 0.8,
        ease: "power3.out",
      });

      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.to(card, {
          scale: i === clamped ? 1 : 0.98,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    },
    [totalSlides]
  );

  const next = useCallback(
    () => goTo(activeIndex >= totalSlides - 1 ? 0 : activeIndex + 1),
    [activeIndex, totalSlides, goTo]
  );
  const prev = useCallback(
    () => goTo(activeIndex <= 0 ? totalSlides - 1 : activeIndex - 1),
    [activeIndex, totalSlides, goTo]
  );

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = prev >= totalSlides - 1 ? 0 : prev + 1;
        if (trackRef.current) {
          const translatePercent = -(nextIdx * (100 / totalSlides));
          gsap.to(trackRef.current, {
            x: `${translatePercent}%`,
            duration: 0.8,
            ease: "power3.out",
          });
        }
        return nextIdx;
      });
    }, 5000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [totalSlides]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 80, opacity: 0, rotateY: -8 },
              {
                y: 0,
                opacity: 1,
                rotateY: 0,
                duration: 0.9,
                ease: "power3.out",
                delay: i * 0.1,
              }
            );
          },
          once: true,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const pauseAutoplay = () => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
  };
  const resumeAutoplay = () => {
    pauseAutoplay();
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIdx = prev >= totalSlides - 1 ? 0 : prev + 1;
        if (trackRef.current) {
          const translatePercent = -(nextIdx * (100 / totalSlides));
          gsap.to(trackRef.current, {
            x: `${translatePercent}%`,
            duration: 0.8,
            ease: "power3.out",
          });
        }
        return nextIdx;
      });
    }, 5000);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-16 sm:py-24 lg:py-32 border-t border-border overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <SectionHeading
            subtitle="Client Testimonials"
            title="What Our Clients Say"
            align="center"
          />
          <div className="flex items-center justify-center sm:justify-end gap-3 sm:mb-16">
            <button
              onClick={() => {
                prev();
                pauseAutoplay();
                resumeAutoplay();
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => {
                next();
                pauseAutoplay();
                resumeAutoplay();
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex transition-transform duration-300 ease-out"
            style={{
              width: `${totalSlides * 100}%`,
            }}
          >
            {testimonials.map((testimonial, i) => (
              <div
                key={testimonial.name}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="px-2 sm:px-3"
                style={{
                  width: `${100 / totalSlides}%`,
                  opacity: 0,
                  perspective: "1200px",
                }}
              >
                <div
                  className={`group relative rounded-2xl border bg-card p-6 sm:p-8 lg:p-10 transition-all duration-500 h-full ${
                    i === activeIndex
                      ? "border-foreground/20 bg-card"
                      : "border-border hover:border-foreground/10"
                  }`}
                >
                  {/* Subtle glow - monochromatic */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-foreground/[0.01] blur-3xl group-hover:bg-foreground/[0.03] transition-colors duration-700 pointer-events-none" />

                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/8 group-hover:text-foreground/15 transition-colors duration-500" />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            starIdx < testimonial.rating
                              ? "text-foreground fill-foreground"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500 mb-8 sm:mb-10">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-foreground/8 border border-border flex items-center justify-center text-xs sm:text-sm font-display font-bold text-foreground flex-shrink-0">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                goTo(i);
                pauseAutoplay();
                resumeAutoplay();
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? "w-6 sm:w-8 bg-foreground"
                  : "w-2 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
