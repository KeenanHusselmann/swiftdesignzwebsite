"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, Code2, ShoppingBag, Smartphone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { trackEvent } from "@/lib/analytics";

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
  const { t } = useI18n();
  const pkgDescKeys: Record<Category, [string, string, string]> = {
    websites: ["packagesPage.wStarterDesc", "packagesPage.wProDesc", "packagesPage.wPremiumDesc"],
    ecommerce: ["packagesPage.eStarterDesc", "packagesPage.eBusinessDesc", "packagesPage.eEnterpriseDesc"],
    apps: ["packagesPage.aMvpDesc", "packagesPage.aStandardDesc", "packagesPage.aFullScaleDesc"],
  };

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
              {t("packagesPage.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("packagesPage.title")} <span className="text-gradient">{t("packagesPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("packagesPage.desc")}
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
                  className={`px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
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
                  {cat.id === "websites" ? t("packagesPage.catWebsites") : cat.id === "ecommerce" ? t("packagesPage.catEcommerce") : t("packagesPage.catApps")}
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto md:items-end"
          >
            {packages[activeCategory].map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
                style={{
                  transform: pkg.highlighted ? "scale(1.04)" : "scale(1)",
                  zIndex: pkg.highlighted ? 2 : 1,
                }}
              >
                {/* Popular badge — outside overflow:hidden wrapper */}
                {pkg.highlighted && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "#fff",
                      boxShadow: "0 0 16px rgba(245,158,11,0.4)",
                      zIndex: 10,
                    }}
                  >
                  MOST POPULAR
                  </div>
                )}

                {/* Electric border wrapper — padding:2px shows the gradient as a border */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{ padding: "2px" }}
                >
                  {/* Rotating conic gradient — fills the 2px gap */}
                  <div
                    className="absolute"
                    style={{
                      width: "300%",
                      height: "300%",
                      top: "-100%",
                      left: "-100%",
                      background: pkg.highlighted
                        ? "conic-gradient(from 0deg, transparent 0%, transparent 35%, #f59e0b 45%, #fcd34d 50%, #f59e0b 55%, transparent 65%, transparent 100%)"
                        : "conic-gradient(from 0deg, transparent 0%, transparent 35%, #30B0B0 45%, #7ef5f5 50%, #30B0B0 55%, transparent 65%, transparent 100%)",
                      animation: "spinElectric 4s linear infinite",
                    }}
                  />

                  {/* Card content — dark bg covers gradient except the 2px edge */}
                  <div
                    className="relative rounded-[14px] flex flex-col"
                    style={{
                      background: pkg.highlighted ? "#0d1520" : "#0a0f1a",
                      padding: pkg.highlighted ? "2.5rem 2rem 2rem" : "1.75rem",
                      zIndex: 1,
                    }}
                  >
                    {/* Tier accent line */}
                    <div
                      className="absolute top-0 left-8 right-8 h-px rounded-full"
                      style={{
                        background: pkg.highlighted
                          ? "linear-gradient(90deg, transparent, #f59e0b, transparent)"
                          : "linear-gradient(90deg, transparent, rgba(48,176,176,0.6), transparent)",
                      }}
                    />

                    {/* Header */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold ${pkg.highlighted ? "text-2xl" : "text-xl"}`}>
                          {pkg.name}
                        </h3>
                        <span
                          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                          style={{
                            background: pkg.highlighted ? "rgba(245,158,11,0.12)" : "rgba(48,176,176,0.08)",
                            color: pkg.highlighted ? "#f59e0b" : "var(--swift-teal)",
                            border: pkg.highlighted ? "1px solid rgba(245,158,11,0.2)" : "1px solid rgba(48,176,176,0.15)",
                          }}
                        >
                        {i === 0 ? t("packagesPage.tier0") : i === 1 ? t("packagesPage.tier1") : t("packagesPage.tier2")}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{t(pkgDescKeys[activeCategory][i])}</p>
                    </div>

                    {/* Price */}
                    <div
                      className="flex items-baseline gap-1 mb-6 pb-5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span className="text-xs text-gray-500">{t("packagesPage.from")}</span>
                      <span
                        className={`font-bold ${pkg.highlighted ? "text-4xl" : "text-3xl text-gradient"}`}
                        style={pkg.highlighted ? {
                          background: "linear-gradient(135deg, #f59e0b, #fcd34d)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        } : undefined}
                      >
                        {pkg.price}
                      </span>
                    </div>

                    {/* Features */}
                    <div className="flex-1">
                      <ul className="space-y-2.5 mb-8">
                        {pkg.features.map((feature, j) => (
                          <li key={j} className="flex items-start gap-2.5 text-sm text-gray-400">
                            <Check
                              size={13}
                              className="mt-0.5 flex-shrink-0"
                              style={{ color: pkg.highlighted ? "#f59e0b" : "var(--swift-teal)" }}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/contact?package=${encodeURIComponent(pkg.name)}&category=${encodeURIComponent(activeCategory)}`}
                      onClick={() => trackEvent("get_quote_click", "packages", `${pkg.name} – ${activeCategory}`)}
                      className={`${pkg.highlighted ? "neon-btn" : "neon-btn-filled neon-btn"} justify-center w-full`}
                    >
                      {t("packagesPage.getQuote")} <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs text-gray-500 mt-12 max-w-xl mx-auto"
          >
            {t("packagesPage.note")}
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
            className="text-center mb-14"
          >
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("packagesPage.trainingEyebrow")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              {t("packagesPage.trainingTitle")} <span className="text-gradient">{t("packagesPage.trainingHighlight")}</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
              {t("packagesPage.trainingDesc")}
            </p>
            <div className="section-divider mx-auto mt-6" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* PM Training */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative glass rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(217,119,6,0.2)" }}
            >
              {/* Top accent */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #d97706, #f59e0b)" }} />
              <div className="p-8">
                <div className="mb-5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(217,119,6,0.08)", color: "#d97706", border: "1px solid rgba(217,119,6,0.22)" }}>
                    {t("packagesPage.workshop")}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t("packagesPage.pmTitle")}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  {t("packagesPage.pmDesc")}
                </p>
                <ul className="space-y-2 mb-7">
                  {[t("packagesPage.pmf1"), t("packagesPage.pmf2"), t("packagesPage.pmf3"), t("packagesPage.pmf4")].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={12} style={{ color: "#d97706", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <Link href="/contact?package=PM+Training&category=Training" onClick={() => trackEvent("enquire_click", "training", "PM Training")} className="neon-btn text-sm">
                    {t("packagesPage.enquireNow")} <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs text-gray-600">{t("packagesPage.customPricing")}</span>
                </div>
              </div>
            </motion.div>

            {/* AI Training */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative glass rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(48,176,176,0.15)" }}
            >
              {/* Top accent */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #30B0B0, #509090)" }} />
              <div className="p-8">
                <div className="mb-5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(48,176,176,0.08)", color: "#30B0B0", border: "1px solid rgba(48,176,176,0.15)" }}>
                    {t("packagesPage.workshop")}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{t("packagesPage.aiTitle")}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                  {t("packagesPage.aiDesc")}
                </p>
                <ul className="space-y-2 mb-7">
                  {[t("packagesPage.aif1"), t("packagesPage.aif2"), t("packagesPage.aif3"), t("packagesPage.aif4")].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={12} style={{ color: "#30B0B0", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <Link href="/contact?package=AI+Training&category=Training" onClick={() => trackEvent("enquire_click", "training", "AI Training")} className="neon-btn-filled neon-btn text-sm">
                    {t("packagesPage.enquireNow")} <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs text-gray-600">{t("packagesPage.customPricing")}</span>
                </div>
              </div>
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
              {t("packagesPage.ctaTitle")} <span className="text-gradient">{t("packagesPage.ctaHighlight")}</span>?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              {t("packagesPage.ctaDesc")}
            </p>
            <Link href="/contact" onClick={() => trackEvent("free_consult_click", "packages_cta")} className="neon-btn-filled neon-btn">
              {t("packagesPage.freeConsult")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
