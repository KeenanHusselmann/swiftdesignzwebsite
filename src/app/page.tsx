"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  ShoppingBag,
  Smartphone,
  GraduationCap,
  BrainCircuit,
  ArrowRight,
  Zap,
  Palette,
  Clock,
} from "lucide-react";
import Link from "next/link";
import TestimonialCard from "@/components/sections/TestimonialCard";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    desc: "Custom websites built with modern frameworks, optimised for speed, SEO, and stunning design.",
    href: "/services#web",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Stores",
    desc: "Online stores and digital catalogues that showcase your products beautifully and drive sales.",
    href: "/services#ecommerce",
  },
  {
    icon: Smartphone,
    title: "Apps & Software",
    desc: "Custom mobile applications and software solutions tailored to your business needs.",
    href: "/services#apps",
  },
  {
    icon: GraduationCap,
    title: "Project Management Training",
    desc: "Equip your team with the skills and methodologies to deliver projects on time and on budget.",
    href: "/services#training",
  },
  {
    icon: BrainCircuit,
    title: "AI Training",
    desc: "Learn how to leverage artificial intelligence to automate workflows and boost productivity.",
    href: "/services#ai",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Quick turnaround without compromising on quality.",
  },
  {
    icon: Palette,
    title: "Creative Design",
    desc: "Unique, eye-catching designs that make your brand stand out.",
  },
  {
    icon: Clock,
    title: "Dedicated Support",
    desc: "Ongoing support and communication throughout your project.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      {/* ======= HERO ======= */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated neon lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-0 w-full h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(48,176,176,0.2), transparent)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-3/4 left-0 w-full h-[1px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(80,144,144,0.15), transparent)",
            }}
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <span
              className="inline-block px-5 py-2 text-xs tracking-[4px] uppercase rounded-full"
              style={{
                background: "rgba(48, 176, 176, 0.08)",
                border: "1px solid rgba(48, 176, 176, 0.15)",
                color: "var(--swift-teal)",
              }}
            >
              Software Development &bull; Design &bull; Innovation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Crafting Digital
            <br />
            <span className="text-gradient">Excellence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light"
          >
            We help brands and businesses come alive in the digital world.
            Fast services. Elegant design. Creative solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/packages" className="neon-btn-filled neon-btn">
              View Packages
              <ArrowRight size={18} />
            </Link>
            <Link href="/portfolio" className="neon-btn">
              See Our Work
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full flex justify-center pt-2"
              style={{ border: "1px solid rgba(48,176,176,0.3)" }}
            >
              <motion.div
                className="w-1 h-2 rounded-full"
                style={{ background: "var(--swift-teal)" }}
                animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ======= HIGHLIGHTS ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass glass-hover p-8 text-center"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(48, 176, 176, 0.08)" }}
                >
                  <item.icon size={24} color="var(--swift-teal)" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======= SERVICES OVERVIEW ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Our <span className="text-gradient">Services</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link href={service.href}>
                  <div className="glass glass-hover p-8 h-full group cursor-pointer">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                      style={{ background: "rgba(48, 176, 176, 0.08)" }}
                    >
                      <service.icon size={22} color="var(--swift-teal)" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-[var(--swift-teal)] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{service.desc}</p>
                    <span className="text-xs text-[var(--swift-teal)] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======= TESTIMONIAL PREVIEW ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              What Clients Say
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Client <span className="text-gradient">Testimonials</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <TestimonialCard
              quote="The banner, overall look and feel, font and clean flowing state of the site is STUNNING. User Experience pleasant, calm and inviting. The way I see it you've done a lot of research than what was probably provided. I am very proud of what you've produced."
              name="Satisfied Client"
              role="Business Owner"
              delay={0}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <TestimonialCard
              quote="From my experience working with many developers across various projects, you should be proud of yourself. You take ownership, and your work ethic truly stands out. Your work clearly reflects your passion, dedication, and skill."
              name="Industry Professional"
              role="Project Manager"
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong p-12 md:p-16 text-center rounded-3xl relative overflow-hidden"
          >
            {/* Decorative border glow */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                border: "1px solid rgba(48, 176, 176, 0.1)",
                boxShadow: "inset 0 1px 0 rgba(48, 176, 176, 0.1)",
              }}
            />

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Build Something{" "}
              <span className="text-gradient">Amazing</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Let&apos;s bring your vision to life. Get in touch and let&apos;s discuss
              how we can make your brand shine in the digital world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="neon-btn-filled neon-btn">
                Start Your Project
                <ArrowRight size={18} />
              </Link>
              <Link href="/packages" className="neon-btn">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
