"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

const WORD_COLORS = [
  "#60a5fa", // blue-400
  "#34d399", // emerald-400
  "#f472b6", // pink-400
  "#fbbf24", // amber-400
  "#a78bfa", // violet-400
];

function useTypewriter(words: string[], colors: string[], typingSpeed = 80, deletingSpeed = 50, pauseDuration = 2200) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tick = useCallback(() => {
    const currentWord = words[currentIndex];

    if (!isDeleting) {
      const nextText = currentWord.substring(0, displayText.length + 1);
      setDisplayText(nextText);

      if (nextText === currentWord) {
        // Pause before deleting
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
      timeoutRef.current = setTimeout(tick, typingSpeed + Math.random() * 40);
    } else {
      const nextText = currentWord.substring(0, displayText.length - 1);
      setDisplayText(nextText);

      if (nextText === "") {
        setIsDeleting(false);
        const nextIndex = (currentIndex + 1) % words.length;
        setCurrentIndex(nextIndex);
        setCurrentColor(colors[nextIndex]);
        timeoutRef.current = setTimeout(tick, 300);
        return;
      }
      timeoutRef.current = setTimeout(tick, deletingSpeed);
    }
  }, [displayText, currentIndex, isDeleting, words, colors, typingSpeed, deletingSpeed, pauseDuration]);

  useEffect(() => {
    timeoutRef.current = setTimeout(tick, typingSpeed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tick, typingSpeed]);

  return { displayText, currentColor, isDeleting };
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

  const { displayText, currentColor, isDeleting } = useTypewriter(ROTATING_WORDS, WORD_COLORS);

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
    const dotCount = 40;

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
        speed: Math.random() * 5 + 3,
        size: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.5 + 0.25,
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
        if (dot.trail.length > 12) dot.trail.pop();

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
          ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
          ctx.globalAlpha = dot.opacity * 0.45;
          ctx.lineWidth = dot.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // Draw glow
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.globalAlpha = dot.opacity * 0.2;
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
      {/* Grid background - fully visible */}
      <div className="absolute z-[1] inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,#000_50%,transparent_100%)]" />

      {/* Canvas dots - full coverage */}
      <canvas
        ref={canvasRef}
        className="absolute z-[2] inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_60%,transparent_95%)]"
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
          {/* Typewriter word */}
          <span className="inline-block overflow-hidden">
            <span
              ref={rotatingRef}
              className="inline-block pb-1"
              style={{ opacity: 0, minWidth: "3ch", borderBottom: `4px solid ${currentColor}`, transition: "border-color 0.4s ease" }}
            >
              <span style={{ color: currentColor, transition: "color 0.4s ease" }}>
                {displayText}
              </span>
              <span
                className="inline-block w-[3px] h-[0.85em] ml-0.5 align-middle"
                style={{
                  backgroundColor: currentColor,
                  transition: "background-color 0.4s ease",
                  animation: "blink 1s step-end infinite",
                }}
              />
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
