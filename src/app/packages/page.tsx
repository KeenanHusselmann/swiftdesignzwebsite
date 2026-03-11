"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Code2, ShoppingBag, Smartphone, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Category = "websites" | "ecommerce" | "apps";

const categories = [
  { id: "websites" as Category, label: "Websites", icon: Code2 },
  { id: "ecommerce" as Category, label: "E-Commerce", icon: ShoppingBag },
  { id: "apps" as Category, label: "Apps & Software", icon: Smartphone },
];

const packages: Record<Category, Array<{
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}>> = {
  websites: [
    {
      name: "Starter",
      price: "R2,800",
      description: "Perfect for personal brands and small businesses getting started online.",
      features: [
        "Up to 5 pages",
        "Responsive design",
        "Basic SEO setup",
        "Contact form",
        "Mobile friendly",
        "2 design revisions",
        "1 month FREE support",
      ],
    },
    {
      name: "Professional",
      price: "R5,500",
      description: "For businesses that want a strong, custom online presence.",
      features: [
        "Up to 10 pages",
        "Fully custom design",
        "Advanced SEO optimisation",
        "Contact form with email integration",
        "Social media integration",
        "Performance optimisation",
        "4 Automations",
        "5 design revisions",
        "2 months FREE support",
        "Analytics setup",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "R10,000",
      description: "The full package for brands that demand excellence and interactivity.",
      features: [
        "10+ pages",
        "Fully custom design + animations",
        "Advanced SEO + analytics",
        "Custom forms & integrations",
        "Blog / news section",
        "Performance & security audit",
        "CMS integration",
        "Unlimited revisions",
        "6 months support",
        "Online Payment integrations",
        "Priority communication",
      ],
    },
  ],
  ecommerce: [
    {
      name: "Starter",
      price: "R4,500",
      description: "A beautiful online catalogue to showcase your products and services.",
      features: [
        "Up to 20 products",
        "Product catalogue display",
        "Category organisation",
        "Contact / enquiry form",
        "Responsive design",
        "Basic SEO setup",
        "2 design revisions",
        "1 month support",
      ],
    },
    {
      name: "Business",
      price: "R7,500",
      description: "A feature-rich store for growing businesses ready to scale.",
      features: [
        "Up to 80 products",
        "Custom storefront design",
        "Advanced product filters & search",
        "Inventory management",
        "Customer enquiry system",
        "WhatsApp integration",
        "Payment Gateway Integration",
        "SEO optimisation",
        "5 design revisions",
        "3 months support",
        "Analytics dashboard",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "R15,000",
      description: "A complete e-commerce solution for established brands.",
      features: [
        "Unlimited products",
        "Fully custom design & branding",
        "Advanced inventory management",
        "Multi-category navigation",
        "Customer accounts",
        "Email marketing integration",
        "Advanced SEO & analytics",
        "CMS for product management",
        "Payment gateway integration",
        "Unlimited revisions",
        "6 months support",
        "Priority communication",
      ],
    },
  ],
  apps: [
    {
      name: "MVP",
      price: "R5,000",
      description: "Launch your idea quickly with core features to validate your concept.",
      features: [
        "Core features only",
        "1 platform (iOS or Android)",
        "Basic UI design",
        "Database setup",
        "Basic QA testing",
        "2 revisions",
        "1 month support",
      ],
    },
    {
      name: "Standard",
      price: "R15,000",
      description: "A fully-featured application built for real-world usage.",
      features: [
        "Full feature set",
        "2 platforms (iOS & Android)",
        "Custom UI/UX design",
        "Cloud integration",
        "API development",
        "Full QA testing",
        "Push notifications",
        "5 revisions",
        "3 months support",
      ],
      highlighted: true,
    },
    {
      name: "Full-Scale",
      price: "R25,000+",
      description: "Enterprise-grade software built to scale and perform.",
      features: [
        "Enterprise-grade architecture",
        "Cross-platform deployment",
        "Premium UI/UX + prototyping",
        "Advanced cloud infrastructure",
        "Full API ecosystem",
        "Full QA + user testing",
        "Admin dashboard",
        "Analytics & reporting",
        "Unlimited revisions",
        "12 months support",
        "Dedicated project manager",
      ],
    },
  ],
};

export default function PackagesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("websites");

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
              Pricing
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Transparent <span className="text-gradient">Packages</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Clear pricing. No hidden fees. Choose the package that suits your needs,
              or get in touch for a custom quote tailored to your project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="pb-4">
        <div className="container">
          <div className="flex justify-center">
            <div
              className="inline-flex gap-2 p-1.5 rounded-xl"
              style={{
                background: "rgba(16, 16, 16, 0.8)",
                border: "1px solid rgba(48, 176, 176, 0.1)",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  style={
                    activeCategory === cat.id
                      ? {
                          background: "rgba(48, 176, 176, 0.15)",
                          boxShadow: "0 0 15px rgba(48, 176, 176, 0.1)",
                        }
                      : undefined
                  }
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section pt-8">
        <div className="container">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {packages[activeCategory].map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${
                  pkg.highlighted ? "glass-strong" : "glass"
                }`}
                style={
                  pkg.highlighted
                    ? {
                        border: "1px solid rgba(48, 176, 176, 0.3)",
                        boxShadow: "0 0 30px rgba(48, 176, 176, 0.08)",
                      }
                    : undefined
                }
              >
                {/* Popular badge */}
                {pkg.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, var(--swift-teal), var(--swift-deep))",
                      color: "#fff",
                    }}
                  >
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{pkg.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-gray-500">From</span>
                    <span className="text-3xl font-bold text-gradient">{pkg.price}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <Check size={14} color="var(--swift-teal)" className="mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/contact"
                  className={`neon-btn justify-center w-full ${
                    pkg.highlighted ? "neon-btn-filled" : ""
                  }`}
                >
                  Get a Quote <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-gray-100 mt-10 max-w-xl mx-auto"
          >
            All prices are starting points and may vary based on project complexity.
            Contact us for a detailed, obligation-free quote tailored to your specific
            requirements.
          </motion.p>
        </div>
      </section>

      {/* Training Services */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              Training Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Upskill Your <span className="text-gradient">Team</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass glass-hover p-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(48, 176, 176, 0.1)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--swift-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Project Management Training</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Learn Agile, Scrum, and proven project management techniques.
                Tailored workshops for your team&apos;s specific needs and skill level.
              </p>
              <Link href="/contact" className="neon-btn text-sm">
                Enquire Now <ArrowRight size={14} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass glass-hover p-8"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(48, 176, 176, 0.1)" }}
              >
                <BrainCircuit size={22} color="var(--swift-teal)" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Training</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Understand and leverage AI tools to automate workflows,
                generate content, and gain competitive advantages in your field.
              </p>
              <Link href="/contact" className="neon-btn text-sm">
                Enquire Now <ArrowRight size={14} />
              </Link>
            </motion.div>
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
              Not Sure Which Package <span className="text-gradient">Fits</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              No worries. Tell us about your project and budget, and we&apos;ll recommend
              the perfect solution. Every project starts with a free consultation.
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              Free Consultation <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
