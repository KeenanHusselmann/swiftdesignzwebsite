"use client";

import { motion } from "framer-motion";
import {
  Code2,
  ShoppingBag,
  Smartphone,
  GraduationCap,
  BrainCircuit,
  ArrowRight,
  Check,
  Layout,
  Search,
  Palette,
  Database,
  Shield,
  Gauge,
  Megaphone,
  BarChart3,
  Cpu,
  Cloud,
  Workflow,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: "web",
    icon: Code2,
    title: "Web Development",
    subtitle: "Custom websites that captivate",
    description:
      "We build modern, responsive websites using the latest frameworks and technologies. Every site is crafted to reflect your brand identity, optimised for performance, and designed to convert visitors into customers.",
    features: [
      { icon: Layout, text: "Responsive Design" },
      { icon: Search, text: "SEO Optimised" },
      { icon: Palette, text: "Custom UI/UX Design" },
      { icon: Gauge, text: "Performance Optimised" },
      { icon: Shield, text: "Security Best Practices" },
      { icon: Code2, text: "Clean, Maintainable Code" },
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "ecommerce",
    icon: ShoppingBag,
    title: "E-Commerce Stores",
    subtitle: "Showcase your products beautifully",
    description:
      "From simple product catalogues to full-featured online stores, we create e-commerce experiences that showcase your products and make it easy for customers to browse, enquire, and buy.",
    features: [
      { icon: ShoppingBag, text: "Product Catalogues" },
      { icon: Database, text: "Inventory Management" },
      { icon: Palette, text: "Custom Storefront Design" },
      { icon: Search, text: "Product Search & Filters" },
      { icon: Megaphone, text: "Marketing Integration" },
      { icon: Gauge, text: "Fast Loading Times" },
    ],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: "apps",
    icon: Smartphone,
    title: "Apps & Software",
    subtitle: "Custom solutions for your business",
    description:
      "Need a mobile app or custom software? We develop tailored solutions that streamline your operations, engage your users, and scale with your business. From MVPs to enterprise-grade systems.",
    features: [
      { icon: Smartphone, text: "Mobile Applications" },
      { icon: Cpu, text: "Custom Software" },
      { icon: Cloud, text: "Cloud Integration" },
      { icon: Database, text: "Database Design" },
      { icon: Shield, text: "Secure Architecture" },
      { icon: Workflow, text: "API Development" },
    ],
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
  },
  {
    id: "training",
    icon: GraduationCap,
    title: "Project Management Training",
    subtitle: "Empower your team",
    description:
      "Equip your team with proven project management methodologies and tools. Our training covers Agile, Scrum, and traditional PM approaches, tailored to your organisation's needs and maturity level.",
    features: [
      { icon: BarChart3, text: "Agile & Scrum" },
      { icon: Workflow, text: "Process Optimisation" },
      { icon: GraduationCap, text: "Team Workshops" },
      { icon: Target, text: "Goal Setting" },
      { icon: Check, text: "Best Practices" },
      { icon: Megaphone, text: "Communication Skills" },
    ],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    id: "ai",
    icon: BrainCircuit,
    title: "AI Training",
    subtitle: "Harness the power of AI",
    description:
      "Artificial intelligence is transforming business. Our AI training helps you understand and leverage AI tools to automate processes, generate content, analyse data, and gain competitive advantages.",
    features: [
      { icon: BrainCircuit, text: "AI Fundamentals" },
      { icon: Cpu, text: "Prompt Engineering" },
      { icon: Workflow, text: "Workflow Automation" },
      { icon: BarChart3, text: "Data Analysis" },
      { icon: Cloud, text: "AI Tools & Platforms" },
      { icon: Lightbulb, text: "Practical Applications" },
    ],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ServicesPage() {
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
              Our Services
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              What We <span className="text-gradient">Deliver</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              From concept to launch, we provide end-to-end digital solutions that
              help your brand stand out. Every service is delivered with creativity,
              precision, and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      {services.map((service, i) => (
        <section key={service.id} id={service.id} className="section">
          <div className="container">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={i % 2 === 1 ? "lg:order-2" : ""}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(48, 176, 176, 0.1)" }}
                  >
                    <service.icon size={20} color="var(--swift-teal)" />
                  </div>
                  <span className="text-xs tracking-[3px] uppercase text-[var(--swift-teal)] font-semibold">
                    {service.subtitle}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
                <div className="section-divider" />
                <p className="text-gray-400 mt-6 mb-8 leading-relaxed">{service.description}</p>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-3 mb-8"
                >
                  {service.features.map((feature, j) => (
                    <motion.div
                      key={j}
                      variants={itemVariants}
                      className="flex items-center gap-2 text-sm text-gray-400"
                    >
                      <feature.icon size={14} color="var(--swift-teal)" />
                      {feature.text}
                    </motion.div>
                  ))}
                </motion.div>

                <Link href="/packages" className="neon-btn">
                  View Packages <ArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative ${i % 2 === 1 ? "lg:order-1" : ""}`}
              >
                <div className="glass p-3 rounded-2xl overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-64 md:h-80 object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                {/* Decorative glow */}
                <div
                  className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] opacity-20"
                  style={{ background: "var(--swift-teal)" }}
                />
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-strong p-8 md:p-12 lg:p-16 text-center rounded-3xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need a <span className="text-gradient">Custom Solution</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Every project is unique. Get in touch and let&apos;s discuss exactly
              what you need. We&apos;ll craft a solution that fits your budget and exceeds your expectations.
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              Get a Quote <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
