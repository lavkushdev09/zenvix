"use client";

import { useEffect, useRef } from "react";
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

  const headline = "What We Do Best";
  const words = headline.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero word animation
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
                delay: i * 0.1,
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

      {/* Services Detail */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col gap-12 lg:gap-16">
            {services.map((service, i) => (
              <div
                key={service.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 rounded-2xl border border-border p-8 lg:p-12 bg-card transition-all duration-500 hover:border-foreground/20"
                style={{ opacity: 0 }}
              >
                {/* Left */}
                <div>
                  <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-all duration-300 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-8">
                    <DirectionalFillButton variant="outline" href="/#contact">
                      Discuss this service
                      <ArrowRight className="w-4 h-4" />
                    </DirectionalFillButton>
                  </div>
                </div>
                {/* Right - features */}
                <div className="flex flex-col gap-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
            {processSteps.map((item, i) => (
              <div
                key={item.step}
                ref={(el) => {
                  stepsRef.current[i] = el;
                }}
                className="bg-background p-8 lg:p-10 group hover:bg-card transition-colors duration-500"
                style={{ opacity: 0 }}
              >
                <span className="font-display text-3xl font-bold text-foreground/10 group-hover:text-foreground/20 transition-colors duration-300">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
