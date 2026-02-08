"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DirectionalFillButton } from "./directional-fill-button";
import { ArrowRight, Mail, MapPin, Clock } from "lucide-react";

interface ContactPageContentProps {
  contact: {
    headline: string;
    description: string;
    email: string;
    cta: { label: string; href: string };
  };
}

export function ContactPageContent({ contact }: ContactPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });

  const headline = "Let's Talk";
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
        infoRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.3"
      );

      tl.fromTo(
        formRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Project Inquiry from ${formData.name || "Website"}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nBudget: ${formData.budget}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Location",
      value: "Remote-first, Global",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Response Time",
      value: "Within 24 hours",
    },
  ];

  const inputClasses =
    "w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition-all duration-300";

  return (
    <div ref={heroRef}>
      {/* Hero */}
      <section className="relative grain">
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
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12">
          <div className="h-px bg-border" />
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
            {/* Left side - info */}
            <div
              ref={infoRef}
              className="lg:col-span-2"
              style={{ opacity: 0 }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {contact.description}
              </p>

              <div className="flex flex-col gap-8">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-sm text-foreground hover:text-muted-foreground transition-colors duration-300"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-sm text-foreground">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="lg:col-span-3 flex flex-col gap-6"
              style={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={inputClasses}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    className={inputClasses}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Inc."
                    className={inputClasses}
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                  >
                    Budget Range
                  </label>
                  <select
                    id="budget"
                    className={inputClasses}
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  >
                    <option value="" className="bg-background text-foreground">
                      Select a range
                    </option>
                    <option
                      value="10k-25k"
                      className="bg-background text-foreground"
                    >
                      $10k - $25k
                    </option>
                    <option
                      value="25k-50k"
                      className="bg-background text-foreground"
                    >
                      $25k - $50k
                    </option>
                    <option
                      value="50k-100k"
                      className="bg-background text-foreground"
                    >
                      $50k - $100k
                    </option>
                    <option
                      value="100k+"
                      className="bg-background text-foreground"
                    >
                      $100k+
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs tracking-widest uppercase text-muted-foreground mb-2"
                >
                  Tell us about your project
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Describe your project, goals, and timeline..."
                  className={`${inputClasses} resize-none`}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mt-2">
                <DirectionalFillButton variant="primary" type="submit">
                  Send Message
                  <ArrowRight className="w-4 h-4" />
                </DirectionalFillButton>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
