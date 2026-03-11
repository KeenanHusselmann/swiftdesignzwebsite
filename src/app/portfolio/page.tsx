"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight, Code2, ShoppingBag, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import TestimonialCard from "@/components/sections/TestimonialCard";

type ProjectCategory = "all" | "websites" | "ecommerce" | "apps";

interface Project {
  title: string;
  category: "websites" | "ecommerce" | "apps";
  description: string;
  image: string;
  tags: string[];
  link?: string;
}

// Template projects - replace with actual projects
const projects: Project[] = [
  {
    title: "TB Free Foundation Website",
    category: "websites",
    description:
      "A stunning, clean-flowing website with an inviting user experience. Custom design with carefully chosen typography and a calm, professional aesthetic.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    tags: ["Custom Design", "Responsive", "SEO"],
  },
  {
    title: "Highly Medicated Website",
    category: "ecommerce",
    description:
      "A beautiful product catalogue showcasing medicinal products with rich imagery and intuitive navigation. Built for engagement and conversions.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    tags: ["E-Commerce", "Product Catalogue", "Custom Design"],
  },
   {
    title: "Ruby's Faith Jewellery Store",
    category: "ecommerce",
    description:
      "An elegant online store for a jewellery brand, featuring a visually rich product catalogue, seamless shopping experience, and a design that reflects the brand's unique style.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    tags: ["E-Commerce", "Product Catalogue", "Custom Design"],
  },
  {
    title: "E-Budgetting App",
    category: "apps",
    description:
      "A sleek, user-friendly budgeting app that helps users track expenses, set financial goals, and visualize spending habits with elegant charts and a calming interface.",
    image: "https://images.unsplash.com/photo-1526506118085-471d8e7e3966?w=600&h=400&fit=crop",
    tags: ["Mobile App", " Native", "Cloud"],
  },
  {
    title: "CK's Creations - Laser Engraving Studio",
    category: "websites",
    description:
      " A visually captivating website for a laser engraving studio, featuring a sleek design that highlights their portfolio of intricate engravings and custom creations.",
    image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&h=400&fit=crop",
    tags: ["Portfolio", "Animation", "Booking"],
  },
  {
    title: "Fryse - Freeze Dried Products",
    category: "ecommerce",
    description:
      "An elegant online store for a freeze-dried food company, showcasing their range of products with rich visuals, easy navigation, and a seamless shopping experience.  ",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    tags: ["Fashion", "E-Commerce", "Filter System"],
  },
  {
    title: "HireMeBuddy - Job Search App",
    category: "apps",
    description:
      "A job search application designed to connect job seekers with potential employers, featuring advanced search filters, resume management, and real-time notifications.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tags: ["Job Search", "Mobile App", "SaaS"],
  },
];

const testimonials = [
  {
    quote:
      "The banner, overall look and feel, font and clean flowing state of the site is STUNNING. User Experience pleasant, calm and inviting. I love it.",
    name: "Satisfied Client",
    role: "Business Owner",
  },
  {
    quote:
      "From my experience working with many developers across various projects, you should be proud of yourself. You take ownership, and your work ethic truly stands out, something I cannot say about many developers I have worked with. Your work clearly reflects your passion, dedication, and skill.",
    name: "Industry Professional",
    role: "Project Manager - Ambrose Isaacs",
  },
];

const filterTabs = [
  { id: "all" as ProjectCategory, label: "All Projects" },
  { id: "websites" as ProjectCategory, label: "Websites", icon: Code2 },
  { id: "ecommerce" as ProjectCategory, label: "E-Commerce", icon: ShoppingBag },
  { id: "apps" as ProjectCategory, label: "Apps", icon: Smartphone },
];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="section pt-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              Portfolio
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Our <span className="text-gradient">Work</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Every project tells a story. Here are some of the digital experiences
              we&apos;ve crafted for our clients. Each one built with passion, precision,
              and an obsessive eye for detail.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-4">
        <div className="container">
          <div className="flex justify-center">
            <div
              className="inline-flex gap-2 p-1.5 rounded-xl flex-wrap justify-center"
              style={{
                background: "rgba(16, 16, 16, 0.8)",
                border: "1px solid rgba(48, 176, 176, 0.1)",
              }}
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeFilter === tab.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={
                    activeFilter === tab.id
                      ? {
                          background: "rgba(48, 176, 176, 0.15)",
                          boxShadow: "0 0 15px rgba(48, 176, 176, 0.1)",
                        }
                      : undefined
                  }
                >
                  {tab.icon && <tab.icon size={14} />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section pt-8">
        <div className="container">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass glass-hover overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-40 md:h-52">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--swift-black)] via-transparent to-transparent opacity-60" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[var(--swift-black)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neon-btn text-sm"
                      >
                        View Project <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 tracking-wider uppercase">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Category badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold"
                    style={{
                      background: "rgba(48, 176, 176, 0.15)",
                      border: "1px solid rgba(48, 176, 176, 0.2)",
                      color: "var(--swift-teal)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {project.category === "ecommerce"
                      ? "E-Commerce"
                      : project.category === "apps"
                      ? "App"
                      : "Website"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--swift-teal)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-[10px] uppercase tracking-wider rounded-md"
                        style={{
                          background: "rgba(48, 176, 176, 0.06)",
                          color: "var(--swift-muted)",
                          border: "1px solid rgba(48, 176, 176, 0.08)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              Client Feedback
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              What They <span className="text-gradient">Say</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={i}
                quote={t.quote}
                name={t.name}
                role={t.role}
                delay={i * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong p-12 md:p-16 text-center rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want Your Project <span className="text-gradient">Here</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Let&apos;s create something worth showcasing. Start your project today
              and join our growing list of satisfied clients.
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              Start Your Project <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
