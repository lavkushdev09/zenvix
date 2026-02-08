"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { DirectionalFillButton } from "./directional-fill-button";

interface HeroProps {
  hero: {
    headline: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}

const ROTATING_WORDS = [
  "Forward",
  "Faster",
  "Smarter",
  "Higher",
  "Better",
];

function useTextScramble(words: string[], interval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);
  const [isScrambling, setIsScrambling] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&";

  useEffect(() => {
    const timer = setInterval(() => {
      setIsScrambling(true);
      const nextIndex = (currentIndex + 1) % words.length;
      const target = words[nextIndex];
      let iteration = 0;
      const maxIterations = target.length;

      const scrambleInterval = setInterval(() => {
        setDisplayText(
          target
            .split("")
            .map((char, i) => {
              if (i < iteration) return char;
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        iteration += 1 / 2;

        if (iteration >= maxIterations) {
          clearInterval(scrambleInterval);
          setDisplayText(target);
          setCurrentIndex(nextIndex);
          setIsScrambling(false);
        }
      }, 30);

      return () => clearInterval(scrambleInterval);
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, words, interval, chars]);

  return { displayText, isScrambling };
}

export function HeroSection({ hero }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const rotatingRef = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  const { displayText, isScrambling } = useTextScramble(ROTATING_WORDS, 3000);

  // Split headline but remove last word ("Forward") since we replace it
  const headlineWithoutLast = hero.headline.replace(/\s+\S+$/, "");
  const words = headlineWithoutLast.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      tl.fromTo(
        badgeRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      tl.fromTo(
        wordsRef.current.filter(Boolean),
        { y: 120, opacity: 0, rotateX: -50 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.07,
        },
        "-=0.3"
      );

      tl.fromTo(
        rotatingRef.current,
        { y: 120, opacity: 0, rotateX: -50 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1 },
        "-=0.6"
      );

      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );

      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.4"
      );

      tl.fromTo(
        counterRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: "power2.inOut" },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Canvas background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    interface GridDot {
      x: number;
      y: number;
      direction: "horizontal" | "vertical";
      speed: number;
      size: number;
      opacity: number;
      targetX: number;
      targetY: number;
      trail: { x: number; y: number }[];
    }

    const gridSize = 64;
    const dotCount = 25;

    const snapToGrid = (value: number) =>
      Math.round(value / gridSize) * gridSize;

    const gridDots: GridDot[] = [];

    for (let i = 0; i < dotCount; i++) {
      const isHorizontal = Math.random() > 0.5;
      const x = snapToGrid(Math.random() * canvas.offsetWidth);
      const y = snapToGrid(Math.random() * canvas.offsetHeight);

      gridDots.push({
        x,
        y,
        direction: isHorizontal ? "horizontal" : "vertical",
        speed: Math.random() * 6 + 4,
        size: Math.random() * 1.5 + 1,
        opacity: Math.random() * 0.4 + 0.15,
        targetX: x,
        targetY: y,
        trail: [],
      });
    }

    let animationId: number;
    let lastTime = 0;
    const frameInterval = 1000 / 30;

    const animate = (currentTime: number) => {
      animationId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      lastTime = currentTime - (deltaTime % frameInterval);

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      gridDots.forEach((dot) => {
        dot.trail.unshift({ x: dot.x, y: dot.y });
        if (dot.trail.length > 8) dot.trail.pop();

        if (dot.direction === "horizontal") {
          if (Math.abs(dot.x - dot.targetX) < dot.speed) {
            dot.x = dot.targetX;
            if (Math.random() > 0.7) {
              dot.direction = "vertical";
              const steps = Math.floor(Math.random() * 5) + 1;
              dot.targetY =
                dot.y +
                (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            } else {
              const steps = Math.floor(Math.random() * 8) + 2;
              dot.targetX =
                dot.x +
                (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            }
          } else {
            dot.x += dot.x < dot.targetX ? dot.speed : -dot.speed;
          }
        } else {
          if (Math.abs(dot.y - dot.targetY) < dot.speed) {
            dot.y = dot.targetY;
            if (Math.random() > 0.7) {
              dot.direction = "horizontal";
              const steps = Math.floor(Math.random() * 8) + 2;
              dot.targetX =
                dot.x +
                (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            } else {
              const steps = Math.floor(Math.random() * 5) + 1;
              dot.targetY =
                dot.y +
                (Math.random() > 0.5 ? 1 : -1) * steps * gridSize;
            }
          } else {
            dot.y += dot.y < dot.targetY ? dot.speed : -dot.speed;
          }
        }

        // Wrap around
        if (dot.x < -gridSize) {
          dot.x = canvas.offsetWidth + gridSize;
          dot.targetX = dot.x;
          dot.trail = [];
        }
        if (dot.x > canvas.offsetWidth + gridSize) {
          dot.x = -gridSize;
          dot.targetX = dot.x;
          dot.trail = [];
        }
        if (dot.y < -gridSize) {
          dot.y = canvas.offsetHeight + gridSize;
          dot.targetY = dot.y;
          dot.trail = [];
        }
        if (dot.y > canvas.offsetHeight + gridSize) {
          dot.y = -gridSize;
          dot.targetY = dot.y;
          dot.trail = [];
        }

        // Draw trail
        if (dot.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          for (let i = 0; i < dot.trail.length; i++) {
            ctx.lineTo(dot.trail[i].x, dot.trail[i].y);
          }
          ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
          ctx.globalAlpha = dot.opacity * 0.3;
          ctx.lineWidth = dot.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.globalAlpha = dot.opacity * 0.1;
        ctx.fill();

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.globalAlpha = dot.opacity;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center grain"
    >
      {/* Grid background */}
      <div className="absolute z-11 inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Canvas dots */}
      <canvas
        ref={canvasRef}
        className="absolute z-11 inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_80%_60%_at_50%_20%,#000_40%,transparent_100%)]"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div ref={badgeRef} className="mb-10" style={{ opacity: 0 }}>
          <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border text-xs tracking-widest uppercase text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            Digital Solutions Studio
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-bold tracking-tight leading-[0.95] text-foreground"
          style={{ perspective: "1000px" }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
              <span
                ref={(el) => {
                  wordsRef.current[i] = el;
                }}
                className="inline-block"
                style={{ opacity: 0 }}
              >
                {word}
              </span>
            </span>
          ))}
          {/* Rotating word */}
          <span className="inline-block overflow-hidden">
            <span
              ref={rotatingRef}
              className={`inline-block border-b-4 border-foreground pb-1 transition-opacity duration-150 ${isScrambling ? "opacity-80" : "opacity-100"
                }`}
              style={{ opacity: 0, minWidth: "3ch" }}
            >
              {displayText}
            </span>
          </span>
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="mt-8 text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-2xl"
          style={{ opacity: 0 }}
        >
          {hero.description}
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <DirectionalFillButton variant="primary" href={hero.primaryCta.href}>
            {hero.primaryCta.label}
            <ArrowRight className="w-4 h-4" />
          </DirectionalFillButton>
          <DirectionalFillButton
            variant="outline"
            href={hero.secondaryCta.href}
          >
            {hero.secondaryCta.label}
          </DirectionalFillButton>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12">
        <div
          ref={lineRef}
          className="h-px bg-border origin-center"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
