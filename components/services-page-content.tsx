"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "./section-heading";
import { DirectionalFillButton } from "./directional-fill-button";
import {
  Code2,
  Cloud,
  Cpu,
  Palette,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Web Development",
    description:
      "Full-stack applications built with modern frameworks and scalable architectures. From single-page apps to complex enterprise platforms.",
    icon: <Code2 className="w-6 h-6" />,
    features: [
      "Custom web application development",
      "Progressive Web Apps (PWA)",
      "E-commerce platforms",
      "API design and development",
      "Performance optimization",
      "Code audits and refactoring",
    ],
  },
  {
    title: "Cloud & DevOps",
    description:
      "Infrastructure design, CI/CD pipelines, and cloud-native deployment strategies that scale with your business.",
    icon: <Cloud className="w-6 h-6" />,
    features: [
      "AWS / GCP / Azure architecture",
      "CI/CD pipeline setup",
      "Container orchestration (Docker/K8s)",
      "Infrastructure as Code (Terraform)",
      "Monitoring and alerting",
      "Cost optimization",
    ],
  },
  {
    title: "AI & Automation",
    description:
      "Intelligent systems that automate workflows and extract actionable insights from your data.",
    icon: <Cpu className="w-6 h-6" />,
    features: [
      "Custom AI/ML model development",
      "Conversational AI and chatbots",
      "Data pipeline automation",
      "Natural language processing",
      "Predictive analytics",
      "Workflow automation",
    ],
  },
  {
    title: "UI/UX Design",
    description:
      "Research-driven design that puts users first and delivers measurable results through intuitive interfaces.",
    icon: <Palette className="w-6 h-6" />,
    features: [
      "User research and testing",
      "Wireframing and prototyping",
      "Design systems",
      "Responsive design",
      "Accessibility (WCAG) compliance",
      "Brand identity and visual design",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We start by understanding your business, goals, and challenges through in-depth conversations and research.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "We craft a tailored plan with clear milestones, technology choices, and a roadmap that aligns with your vision.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Our team designs and develops your solution with iterative sprints, keeping you informed at every step.",
  },
  {
    step: "04",
    title: "Launch & Scale",
    description:
      "We deploy, monitor, and optimize your product for peak performance, and continue to support you as you grow.",
  },
];

export function ServicesPageContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const processRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeService, setActiveService] = useState(0);

  const headline = "What We Do Best";
  const words = headline.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      tl.fromTo(
        wordsRef.current.filter(Boolean),
        { y: 100, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.08 }
      );

      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3"
      );

      // Service cards
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              card,
              { y: 60, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out",
                delay: i * 0.12,
              }
            );
          },
          once: true,
        });
      });

      // Process steps
      stepsRef.current.filter(Boolean).forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              step,
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power3.out",
                delay: i * 0.1,
              }
            );
          },
          once: true,
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-center grain">
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pt-32 pb-16">
          <h1
            className="font-display text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.95] text-foreground"
            style={{ perspective: "1000px" }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden mr-[0.25em]"
              >
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
          </h1>
          <p
            ref={descRef}
            className="mt-8 text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-2xl"
            style={{ opacity: 0 }}
          >
            We combine deep technical expertise with design thinking to deliver
            solutions that solve real problems and drive measurable outcomes.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12">
          <div className="h-px bg-border" />
        </div>
      </section>

      {/* Interactive Services Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Service navigation tabs */}
          <div className="flex flex-wrap gap-3 mb-16">
            {services.map((service, i) => (
              <button
                key={service.title}
                onClick={() => setActiveService(i)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all duration-400 border ${
                  activeService === i
                    ? "border-foreground/30 bg-foreground/5 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all duration-400 ${
                    activeService === i
                      ? "bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      : "bg-muted-foreground"
                  }`}
                />
                {service.title}
              </button>
            ))}
          </div>

          {/* Active service detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Left: Service info */}
            <div className="lg:col-span-5">
              <div className="w-14 h-14 rounded-2xl border border-border flex items-center justify-center mb-8 text-foreground transition-all duration-500">
                {services[activeService].icon}
              </div>
              <h3 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4 tracking-tight">
                {services[activeService].title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {services[activeService].description}
              </p>
              <DirectionalFillButton variant="outline" href="/#contact">
                Discuss this service
                <ArrowRight className="w-4 h-4" />
              </DirectionalFillButton>
            </div>

            {/* Right: Features grid */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services[activeService].features.map((feature) => (
                  <div
                    key={feature}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-foreground/15 transition-all duration-400"
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-foreground/40 group-hover:text-foreground transition-colors duration-400" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground leading-relaxed transition-colors duration-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All services overview cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group relative rounded-2xl border border-border p-8 bg-card transition-all duration-500 hover:border-foreground/20 overflow-hidden"
                style={{ opacity: 0 }}
                onMouseEnter={() => setActiveService(i)}
              >
                {/* Accent top border - monochromatic */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-all duration-400">
                    {service.icon}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground/30 tracking-widest">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section ref={processRef} className="py-24 lg:py-32 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <SectionHeading
            subtitle="How We Work"
            title="Our Process"
            description="A proven approach that combines strategy, design, and engineering to deliver exceptional digital products."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((item, i) => (
              <div
                key={item.step}
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="group relative rounded-2xl border border-border bg-card p-8 lg:p-10 hover:border-foreground/20 transition-all duration-500 overflow-hidden"
                style={{ opacity: 0 }}
              >
                <span className="absolute -top-4 -right-2 font-display text-[6rem] font-bold text-foreground/[0.03] group-hover:text-foreground/[0.06] transition-colors duration-500 leading-none select-none">
                  {item.step}
                </span>
                <div className="relative">
                  <span className="inline-block font-display text-sm font-bold text-foreground/30 group-hover:text-foreground/50 transition-colors duration-300 mb-6">
                    Step {item.step}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
