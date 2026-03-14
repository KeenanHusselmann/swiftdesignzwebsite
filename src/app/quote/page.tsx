"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildPlan, Phase } from "@/lib/quoteUtils";
import {
  Send, CheckCircle, AlertCircle, ChevronRight, ChevronLeft,
  Globe, ShoppingCart, Smartphone, Cpu, LayoutList, PenLine,
} from "lucide-react";

// ─── DATA ───────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: "website",     label: "Website",        Icon: Globe,        desc: "Business sites, landing pages, portfolios" },
  { id: "ecommerce",   label: "E-Commerce",     Icon: ShoppingCart, desc: "Online stores, Shopify, product catalogues" },
  { id: "app",         label: "App / Software", Icon: Smartphone,   desc: "Web apps, mobile apps, custom tools" },
  { id: "ai-training", label: "AI Training",    Icon: Cpu,          desc: "AI tools training for individuals & teams" },
  { id: "pm-training", label: "PM Training",    Icon: LayoutList,   desc: "Agile, Scrum, Kanban, PM coaching" },
] as const;

type ServiceId = typeof SERVICES[number]["id"];

const PACKAGES: Record<ServiceId, { id: string; label: string; price: string; desc: string }[]> = {
  website: [
    { id: "starter",      label: "Starter",      price: "from R2,500",  desc: "Up to 3 pages · Mobile-responsive · Basic design" },
    { id: "professional", label: "Professional", price: "from R5,000",  desc: "Up to 7 pages · Custom design · Animations" },
    { id: "premium",      label: "Premium",      price: "from R10,000", desc: "10+ pages · Full custom · Advanced SEO" },
    { id: "not-sure",     label: "Not sure yet", price: "",             desc: "We will advise based on your requirements" },
  ],
  ecommerce: [
    { id: "starter",    label: "Starter",    price: "from R4,000",  desc: "Up to 20 products · Basic storefront" },
    { id: "business",   label: "Business",   price: "from R7,500",  desc: "Up to 100 products · Custom theme · Advanced checkout" },
    { id: "enterprise", label: "Enterprise", price: "from R15,000", desc: "Unlimited products · Full custom · ERP integrations" },
    { id: "not-sure",   label: "Not sure yet", price: "",           desc: "We will advise based on your requirements" },
  ],
  app: [
    { id: "mvp",        label: "MVP",        price: "from R5,000",  desc: "Core features · 1 platform · Auth & deployment" },
    { id: "standard",   label: "Standard",   price: "from R12,000", desc: "Full features · 2 platforms · Admin dashboard" },
    { id: "full-scale", label: "Full-Scale", price: "from R25,000", desc: "Enterprise-grade · Cross-platform · CI/CD" },
    { id: "not-sure",   label: "Not sure yet", price: "",           desc: "We will scope based on your requirements" },
  ],
  "ai-training": [
    { id: "individual", label: "Individual Session", price: "Custom rate", desc: "30-min one-on-one · Remote" },
    { id: "team",       label: "Team Training",       price: "Custom rate", desc: "1.5hr group session · Remote" },
    { id: "workshop",   label: "Workshop / Course",   price: "Custom rate", desc: "Full day · Multi-session programme" },
    { id: "not-sure",   label: "Not sure yet",        price: "",            desc: "We will find the right format for you" },
  ],
  "pm-training": [
    { id: "individual", label: "Individual Session", price: "Custom rate", desc: "30-min one-on-one · Remote" },
    { id: "team",       label: "Team Training",       price: "Custom rate", desc: "1.5hr group session · Remote" },
    { id: "workshop",   label: "Workshop / Course",   price: "Custom rate", desc: "Full day · Certifications prep" },
    { id: "not-sure",   label: "Not sure yet",        price: "",            desc: "We will find the right format for you" },
  ],
};

const FEATURES: Record<ServiceId, string[]> = {
  website: [
    "SEO Optimisation", "Blog / News Section", "Portfolio / Gallery", "Contact Form",
    "Newsletter Integration", "Social Media Links", "Analytics Integration",
    "Live Chat Widget", "Google Maps Embed", "Custom Logo Design",
  ],
  ecommerce: [
    "PayFast Payment Gateway", "Stripe Payment Gateway", "Inventory Management",
    "Discount / Coupon Codes", "Customer Accounts", "Wishlist Functionality",
    "Product Reviews", "Multi-Currency", "Abandoned Cart Recovery", "Email Marketing Integration",
  ],
  app: [
    "User Authentication", "Admin Dashboard", "Push Notifications", "Offline Mode",
    "Payment Integration", "Third-party API Integration", "Analytics Dashboard",
    "Multi-language Support", "Dark / Light Mode", "Real-time Features",
  ],
  "ai-training": [
    "ChatGPT / Claude Workflow Training", "AI for Business Productivity", "AI for Marketing & Content",
    "AI for Coding & Development", "Custom AI Automation", "Course Notes & Materials",
    "Ongoing Support Package", "Team Assessment Included",
  ],
  "pm-training": [
    "Agile / Scrum Framework", "Kanban Methodology", "Jira Setup & Training",
    "Notion Workspace Setup", "Asana Setup", "PMP Certification Prep",
    "Team Facilitation Skills", "Process Documentation",
  ],
};

const LOOK_AND_FEEL = [
  "Clean & Minimal",
  "Bold & Modern",
  "Elegant & Luxury",
  "Playful & Fun",
  "Corporate & Professional",
  "Dark & Moody",
  "Bright & Vibrant",
  "Retro / Vintage",
  "Futuristic / Tech",
  "Nature & Organic",
];

const THEMES = [
  "Dark theme",
  "Light theme",
  "Both (light + dark toggle)",
  "Neon / Cyberpunk",
  "Ocean / Blue tones",
  "Forest / Green tones",
  "Warm / Orange & Red tones",
  "Monochrome",
  "Custom brand colours",
];

const VIBE_KEYWORDS = [
  "Trustworthy",
  "Creative",
  "Innovative",
  "Premium",
  "Friendly",
  "Authoritative",
  "Energetic",
  "Calm",
  "Approachable",
  "Sleek",
  "Inspiring",
  "No-nonsense",
];

const TIMELINE_OPTIONS = [
  "ASAP (within 2 weeks)",
  "1 month",
  "2 to 3 months",
  "3 to 6 months",
  "No rush - quality over speed",
];

const SOURCE_OPTIONS = [
  "Google Search",
  "Social Media (Instagram / Facebook)",
  "LinkedIn",
  "Referral from someone I know",
  "Saw your portfolio",
  "Other",
];

// ─── PROPOSED PLAN DATA (imported from @/lib/quoteUtils) ───────────────────
export type { Phase };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const STEPS = [
  { id: 1, label: "Contact Info" },
  { id: 2, label: "Service & Package" },
  { id: 3, label: "Project Details" },
  { id: 4, label: "Review & Submit" },
];

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface FormState {
  name: string; email: string; phone: string; company: string; location: string;
  service: ServiceId | ""; package: string;
  features: string[]; lookFeel: string[]; themes: string[]; keywords: string[];
  scope: string; timeline: string; contentReady: string; referenceUrls: string;
  attendees: string; experienceLevel: string;
  budget: string; notes: string; source: string;
}

const INITIAL: FormState = {
  name: "", email: "", phone: "", company: "", location: "",
  service: "", package: "",
  features: [], lookFeel: [], themes: [], keywords: [],
  scope: "", timeline: "", contentReady: "", referenceUrls: "",
  attendees: "", experienceLevel: "",
  budget: "", notes: "", source: "",
};

const DESCRIPTION_PLACEHOLDER: Record<ServiceId, string> = {
  website:      "What kind of website do you need? What is the goal? Who is your audience? Any specific pages or features in mind?",
  ecommerce:    "Tell us about your store. What are you selling? Do you have existing branding? How many products do you plan to list?",
  app:          "What problem does your app solve? Who will use it? What core features must it have? Do you need iOS, Android, or web?",
  "ai-training": "What are your AI learning goals? What tools does your team currently use? What outcomes do you want from this training?",
  "pm-training": "What project management challenges do you face? What methodology are you using? What do you want your team to learn?",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function QuotePage() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Disable browser scroll restoration so it can't fight us, then jump to top
  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [planeFly, setPlaneFly] = useState(false);
  const [planeKey, setPlaneKey] = useState(0);
  const [quoteRef, setQuoteRef] = useState("");

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const toggleFeature = (f: string) =>
    set("features", form.features.includes(f) ? form.features.filter((x) => x !== f) : [...form.features, f]);
  const toggleLookFeel = (f: string) =>
    set("lookFeel", form.lookFeel.includes(f) ? form.lookFeel.filter((x) => x !== f) : [...form.lookFeel, f]);
  const toggleTheme = (f: string) =>
    set("themes", form.themes.includes(f) ? form.themes.filter((x) => x !== f) : [...form.themes, f]);
  const toggleKeyword = (f: string) =>
    set("keywords", form.keywords.includes(f) ? form.keywords.filter((x) => x !== f) : [...form.keywords, f]);

  const canNext = () => {
    if (step === 1) return form.name.trim() !== "" && form.email.trim() !== "";
    if (step === 2) return form.service !== "" && form.package !== "";
    if (step === 3) return form.scope.trim().length > 10;
    return true;
  };

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const next = () => { if (canNext()) { setStep((s) => (s < 4 ? (s + 1) as 1 | 2 | 3 | 4 : s)); setTimeout(scrollToForm, 50); } };
  const back = () => { setStep((s) => (s > 1 ? (s - 1) as 1 | 2 | 3 | 4 : s)); setTimeout(scrollToForm, 50); };

  const submit = async () => {
    setStatus("sending");
    setErrorMsg("");
    setPlaneKey((k) => k + 1);
    setPlaneFly(true);
    setTimeout(() => setPlaneFly(false), 1800);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to send");
      setStatus("success");
      setQuoteRef(`SD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went sideways on our end. Give it another shot!");
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all";
  const inputStyle = { background: "rgba(16,16,16,0.6)", border: "1px solid rgba(48,176,176,0.15)" };
  const labelCls = "block text-xs text-gray-500 uppercase tracking-wider mb-2";

  const currentService = form.service as ServiceId | "";
  const hasStarted = step > 1 || Object.values(form).some((v) => Array.isArray(v) ? v.length > 0 : Boolean(v));

  return (
    <>
      {/* Fixed notice card — hidden once user starts filling the form */}
      <AnimatePresence>
      {!hasStarted && (
      <motion.div
        key="quick-notice"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40, transition: { duration: 0.3 } }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-24 left-4 right-4 z-50 flex items-start gap-3 rounded-2xl px-4 py-3.5 pointer-events-none md:bottom-auto md:top-24 md:left-auto md:right-5 md:max-w-[230px]"
        style={{
          background: "rgba(20,14,4,0.72)",
          border: "1px solid rgba(217,119,6,0.35)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 4px 32px rgba(217,119,6,0.12), inset 0 1px 0 rgba(255,200,80,0.07)",
        }}
      >
        <motion.div
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-0.5 flex-shrink-0"
          style={{ color: "#f59e0b" }}
        >
          <PenLine size={16} />
        </motion.div>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: "#fbbf24" }}>Quick &amp; easy</p>
          <p className="text-[11px] leading-relaxed" style={{ color: "rgba(253,230,138,0.65)" }}>
            4 simple steps, under 2 minutes. So straightforward, even my gran nailed it.
          </p>
        </div>
      </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {planeFly && (
          <motion.div
            key={planeKey}
            className="fixed z-[9999] pointer-events-none"
            style={{ bottom: "45%", left: "50%", x: "-50%" }}
            initial={{ x: "-50%", y: 0, rotate: -30, opacity: 1, scale: 2 }}
            animate={{ x: "60vw", y: "-60vh", rotate: -45, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Send size={36} color="var(--swift-teal)" style={{ filter: "drop-shadow(0 0 10px rgba(48,176,176,0.9))" }} />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="section pt-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6 flex justify-center"
            >
              <motion.img
                src="/images/favicon.png"
                alt="Swift Designz"
                className="w-[9.5rem] h-[9.5rem] md:w-48 md:h-48"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ filter: "drop-shadow(0 0 12px rgba(48,176,176,0.4)) drop-shadow(0 0 24px rgba(48,176,176,0.2))" }}
              />
            </motion.div>
            <span className="text-xs tracking-[4px] uppercase" style={{ color: "#f59e0b" }}>Get a Quote</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Let&apos;s Build <span style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Something</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Fill in the form below and we&apos;ll put together a tailored proposal.
              No obligations, just a conversation about what&apos;s possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section pt-4 pb-24" ref={formRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-between mb-8 px-1">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 " + (
                        step > s.id
                          ? "bg-[var(--swift-teal)] text-black"
                          : step === s.id
                          ? "bg-[var(--swift-teal)] text-black shadow-[0_0_14px_rgba(48,176,176,0.6)]"
                          : "bg-white/5 text-gray-500"
                      )}
                    >
                      {step > s.id ? <CheckCircle size={14} /> : s.id}
                    </div>
                    <span className={"text-[10px] mt-1.5 uppercase tracking-wider hidden sm:block " + (step === s.id ? "text-[var(--swift-teal)]" : "text-gray-600")}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-px mx-2 mt-[-10px] sm:mt-[-18px] transition-all duration-500"
                      style={{ background: step > s.id ? "#f59e0b" : step === s.id ? "rgba(245,158,11,0.25)" : "rgba(48,176,176,0.12)" }}
                    />
                  )}
                </div>
              ))}
            </div>

            {status !== "success" && (
              <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
                <div
                  className="absolute"
                  style={{
                    width: "300%", height: "300%", top: "-100%", left: "-100%",
                    background: "conic-gradient(from 0deg, transparent 0deg, #f59e0b 40deg, #fbbf24 80deg, transparent 140deg, transparent 220deg, #30B0B0 280deg, #7ef5f5 320deg, transparent 360deg)",
                    animation: "spinElectric 6s linear infinite",
                  }}
                />
                <div className="relative rounded-[14px] p-6 md:p-8 lg:p-10" style={{ background: "#0a0f1a" }}>
                  <AnimatePresence mode="wait">

                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                        <h2 className="text-xl font-bold mb-1 text-white">Your Contact Details</h2>
                        <p className="text-sm text-gray-500 mb-6">So we know who to send the proposal to.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelCls}>Full Name *</label>
                            <input type="text" required placeholder="Your full name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} style={inputStyle} />
                          </div>
                          <div>
                            <label className={labelCls}>Email Address *</label>
                            <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} style={inputStyle} />
                          </div>
                          <div>
                            <label className={labelCls}>Phone Number</label>
                            <input type="tel" placeholder="+" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} style={inputStyle} />
                          </div>
                          <div>
                            <label className={labelCls}>Company / Organisation</label>
                            <input type="text" placeholder="If applicable" value={form.company} onChange={(e) => set("company", e.target.value)} className={inputCls} style={inputStyle} />
                          </div>
                          <div className="md:col-span-2">
                            <label className={labelCls}>City / Location</label>
                            <input type="text" placeholder="e.g. Cape Town, South Africa" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} style={inputStyle} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                        <h2 className="text-xl font-bold mb-1 text-white">What Are You Looking For?</h2>
                        <p className="text-sm text-gray-500 mb-6">Select a service, then choose your preferred package.</p>
                        <label className={labelCls}>Service Type *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                          {SERVICES.map(({ id, label, Icon, desc }) => (
                            <button
                              key={id} type="button"
                              onClick={() => { set("service", id); set("package", ""); set("features", []); }}
                              className={"p-4 rounded-xl text-left transition-all duration-200 border " + (
                                form.service === id
                                  ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.08)] shadow-[0_0_18px_rgba(48,176,176,0.18)]"
                                  : "border-white/5 bg-white/[0.02] hover:border-[rgba(48,176,176,0.25)] hover:bg-white/[0.04]"
                              )}
                            >
                              <Icon size={20} className={form.service === id ? "text-[var(--swift-teal)]" : "text-gray-500"} />
                              <div className={"text-sm font-semibold mt-2 " + (form.service === id ? "text-[var(--swift-teal)]" : "text-white")}>{label}</div>
                              <div className="text-[11px] text-gray-500 mt-1 leading-tight">{desc}</div>
                            </button>
                          ))}
                        </div>
                        <AnimatePresence>
                          {currentService && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                              <label className={labelCls}>Package *</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {PACKAGES[currentService].map((pkg) => (
                                  <button
                                    key={pkg.id} type="button"
                                    onClick={() => set("package", pkg.id)}
                                    className={"p-4 rounded-xl text-left transition-all duration-200 border " + (
                                      form.package === pkg.id
                                        ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.08)] shadow-[0_0_18px_rgba(48,176,176,0.18)]"
                                        : "border-white/5 bg-white/[0.02] hover:border-[rgba(48,176,176,0.25)] hover:bg-white/[0.04]"
                                    )}
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <span className={"text-sm font-bold " + (form.package === pkg.id ? "text-[var(--swift-teal)]" : "text-white")}>{pkg.label}</span>
                                      {pkg.price && <span className="text-xs font-mono text-[var(--swift-teal)] opacity-75 flex-shrink-0">{pkg.price}</span>}
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1.5 leading-tight">{pkg.desc}</p>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                        <h2 className="text-xl font-bold mb-1 text-white">Tell Us About Your Project</h2>
                        <p className="text-sm text-gray-500 mb-6">The more detail you give us, the more tailored the proposal.</p>
                        <div className="mb-5">
                          <label className={labelCls}>Project Description *</label>
                          <textarea
                            rows={4}
                            placeholder={currentService ? DESCRIPTION_PLACEHOLDER[currentService] : "Describe your project or requirements..."}
                            value={form.scope}
                            onChange={(e) => set("scope", e.target.value)}
                            className={inputCls + " resize-none"}
                            style={inputStyle}
                          />
                          {form.scope.trim().length > 0 && form.scope.trim().length < 10 && (
                            <p className="text-xs text-amber-500 mt-1.5">Please give us a bit more detail.</p>
                          )}
                        </div>
                        {currentService && (
                          <div className="mb-5">
                            <label className={labelCls}>Features / Requirements (select all that apply)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {FEATURES[currentService].map((f) => (
                                <button
                                  key={f} type="button"
                                  onClick={() => toggleFeature(f)}
                                  className={"flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12px] text-left transition-all border " + (
                                    form.features.includes(f)
                                      ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.08)] text-[var(--swift-teal)]"
                                      : "border-white/5 bg-white/[0.02] text-gray-400 hover:border-[rgba(48,176,176,0.2)]"
                                  )}
                                >
                                  <span className={"w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-[9px] font-bold transition-all " + (
                                    form.features.includes(f) ? "border-[var(--swift-teal)] bg-[var(--swift-teal)] text-black" : "border-gray-600"
                                  )}>{form.features.includes(f) ? "v" : ""}</span>
                                  {f}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {["website", "ecommerce", "app"].includes(form.service) && (
                          <>
                            <div className="mb-5">
                              <label className={labelCls}>Look &amp; Feel (select all that apply)</label>
                              <div className="flex flex-wrap gap-2">
                                {LOOK_AND_FEEL.map((f) => (
                                  <button key={f} type="button" onClick={() => toggleLookFeel(f)}
                                    className={"px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border " + (
                                      form.lookFeel.includes(f)
                                        ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.12)] text-[var(--swift-teal)]"
                                        : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[rgba(48,176,176,0.3)]"
                                    )}>{f}</button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-5">
                              <label className={labelCls}>Colour Theme (select all that apply)</label>
                              <div className="flex flex-wrap gap-2">
                                {THEMES.map((f) => (
                                  <button key={f} type="button" onClick={() => toggleTheme(f)}
                                    className={"px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border " + (
                                      form.themes.includes(f)
                                        ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.12)] text-[var(--swift-teal)]"
                                        : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[rgba(48,176,176,0.3)]"
                                    )}>{f}</button>
                                ))}
                              </div>
                            </div>
                            <div className="mb-5">
                              <label className={labelCls}>Words That Describe Your Brand / Site Vibe</label>
                              <div className="flex flex-wrap gap-2">
                                {VIBE_KEYWORDS.map((f) => (
                                  <button key={f} type="button" onClick={() => toggleKeyword(f)}
                                    className={"px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border " + (
                                      form.keywords.includes(f)
                                        ? "border-[var(--swift-teal)] bg-[rgba(48,176,176,0.12)] text-[var(--swift-teal)]"
                                        : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-[rgba(48,176,176,0.3)]"
                                    )}>{f}</button>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className={labelCls}>Desired Timeline</label>
                            <select value={form.timeline} onChange={(e) => set("timeline", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                              <option value="" style={{ background: "#101010" }}>Select a timeline</option>
                              {TIMELINE_OPTIONS.map((o) => <option key={o} value={o} style={{ background: "#101010" }}>{o}</option>)}
                            </select>
                          </div>

                          {["website", "ecommerce", "app"].includes(form.service) ? (
                            <>
                              <div>
                                <label className={labelCls}>Do You Have Content Ready?</label>
                                <select value={form.contentReady} onChange={(e) => set("contentReady", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                                  <option value="" style={{ background: "#101010" }}>Select an option</option>
                                  <option value="Yes - ready to go" style={{ background: "#101010" }}>Yes - ready to go</option>
                                  <option value="Partially ready" style={{ background: "#101010" }}>Partially ready</option>
                                  <option value="No - will need help" style={{ background: "#101010" }}>No - will need help with content</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className={labelCls}>Reference / Inspiration Websites (optional)</label>
                                <input type="text" placeholder="e.g. https://example.com, https://another.com" value={form.referenceUrls} onChange={(e) => set("referenceUrls", e.target.value)} className={inputCls} style={inputStyle} />
                              </div>
                            </>
                          ) : ["ai-training", "pm-training"].includes(form.service) ? (
                            <>
                              <div>
                                <label className={labelCls}>Number of Attendees</label>
                                <select value={form.attendees} onChange={(e) => set("attendees", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                                  <option value="" style={{ background: "#101010" }}>Select a range</option>
                                  <option value="Just me (1)" style={{ background: "#101010" }}>Just me (1)</option>
                                  <option value="2 to 5 people" style={{ background: "#101010" }}>2 to 5 people</option>
                                  <option value="6 to 15 people" style={{ background: "#101010" }}>6 to 15 people</option>
                                  <option value="16 to 30 people" style={{ background: "#101010" }}>16 to 30 people</option>
                                  <option value="30+ people" style={{ background: "#101010" }}>30+ people</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className={labelCls}>Current Experience Level</label>
                                <select value={form.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                                  <option value="" style={{ background: "#101010" }}>Select a level</option>
                                  <option value="Complete beginner" style={{ background: "#101010" }}>Complete beginner</option>
                                  <option value="Some awareness" style={{ background: "#101010" }}>Some awareness — heard of it, not used it</option>
                                  <option value="Occasional user" style={{ background: "#101010" }}>Occasional user — tried it a few times</option>
                                  <option value="Regular user" style={{ background: "#101010" }}>Regular user — use it daily</option>
                                  <option value="Mixed team" style={{ background: "#101010" }}>Mixed — the team has varying levels</option>
                                </select>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
                        <h2 className="text-xl font-bold mb-1 text-white">Review &amp; Submit</h2>
                        <p className="text-sm text-gray-500 mb-6">Double-check your details, then send your request.</p>
                        <div className="rounded-xl p-5 mb-6 space-y-2 text-sm" style={{ background: "rgba(48,176,176,0.04)", border: "1px solid rgba(48,176,176,0.12)" }}>
                          <SummaryRow label="Name" value={form.name} />
                          <SummaryRow label="Email" value={form.email} highlight />
                          {form.phone && <SummaryRow label="Phone" value={form.phone} />}
                          {form.company && <SummaryRow label="Company" value={form.company} />}
                          {form.location && <SummaryRow label="Location" value={form.location} />}
                          <div className="border-t border-white/5 pt-2 mt-2">
                            <SummaryRow label="Service" value={SERVICES.find((s) => s.id === form.service)?.label ?? ""} />
                            <SummaryRow label="Package" value={form.package} chip />
                          </div>
                          {form.features.length > 0 && (
                            <div className="border-t border-white/5 pt-2 mt-2">
                              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Features requested</span>
                              <p className="text-[var(--swift-teal)] text-xs mt-1 leading-relaxed">{form.features.join(" · ")}</p>
                            </div>
                          )}
                          {form.timeline && <SummaryRow label="Timeline" value={form.timeline} />}
                          {form.contentReady && <SummaryRow label="Content" value={form.contentReady} />}
                          {form.lookFeel.length > 0 && (
                            <div className="border-t border-white/5 pt-2 mt-2">
                              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Look &amp; feel</span>
                              <p className="text-[var(--swift-teal)] text-xs mt-1 leading-relaxed">{form.lookFeel.join(" · ")}</p>
                            </div>
                          )}
                          {form.themes.length > 0 && (
                            <div className="border-t border-white/5 pt-2 mt-2">
                              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Theme</span>
                              <p className="text-[var(--swift-teal)] text-xs mt-1 leading-relaxed">{form.themes.join(" · ")}</p>
                            </div>
                          )}
                          {form.keywords.length > 0 && (
                            <div className="border-t border-white/5 pt-2 mt-2">
                              <span className="text-gray-500 uppercase text-[10px] tracking-wider">Vibe keywords</span>
                              <p className="text-[var(--swift-teal)] text-xs mt-1 leading-relaxed">{form.keywords.join(" · ")}</p>
                            </div>
                          )}
                        </div>
                        <div className="mb-5">
                          <label className={labelCls}>Your Budget Range (optional)</label>
                          <select value={form.budget} onChange={(e) => set("budget", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                            <option value="" style={{ background: "#101010" }}>Select a range (or leave blank)</option>
                            <option value="R2,500 to R5,000" style={{ background: "#101010" }}>R2,500 to R5,000</option>
                            <option value="R5,000 to R10,000" style={{ background: "#101010" }}>R5,000 to R10,000</option>
                            <option value="R10,000 to R25,000" style={{ background: "#101010" }}>R10,000 to R25,000</option>
                            <option value="R25,000+" style={{ background: "#101010" }}>R25,000+</option>
                            <option value="Not sure yet" style={{ background: "#101010" }}>Not sure yet</option>
                          </select>
                        </div>
                        <div className="mb-5">
                          <label className={labelCls}>Anything Else to Add? (optional)</label>
                          <textarea rows={3} placeholder="Any other details, questions, or context..." value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputCls + " resize-none"} style={inputStyle} />
                        </div>
                        <div className="mb-7">
                          <label className={labelCls}>How Did You Hear About Us?</label>
                          <select value={form.source} onChange={(e) => set("source", e.target.value)} className={inputCls + " appearance-none cursor-pointer"} style={inputStyle}>
                            <option value="" style={{ background: "#101010" }}>Select an option</option>
                            {SOURCE_OPTIONS.map((o) => <option key={o} value={o} style={{ background: "#101010" }}>{o}</option>)}
                          </select>
                        </div>
                        <button type="button" onClick={submit} disabled={status === "sending"} className="neon-btn-filled neon-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
                          {status === "sending" ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                          ) : (
                            <><Send size={16} /> Submit Quote Request</>
                          )}
                        </button>
                        {status === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 rounded-xl p-4"
                            style={{
                              background: "rgba(20,8,8,0.72)",
                              border: "1px solid rgba(255,80,80,0.22)",
                              backdropFilter: "blur(12px)",
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                style={{
                                  flexShrink: 0,
                                  marginTop: 1,
                                  width: 32,
                                  height: 32,
                                  borderRadius: "50%",
                                  background: "rgba(255,80,80,0.1)",
                                  border: "1px solid rgba(255,80,80,0.2)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <AlertCircle size={15} color="#ff6464" />
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-0.5" style={{ color: "#ff7070" }}>Oops — something went wrong</p>
                                <p className="text-xs leading-relaxed" style={{ color: "#aa6060" }}>{errorMsg}</p>
                                <p className="text-xs mt-1.5" style={{ color: "#554444" }}>Check your details and try again. If it keeps happening, <a href="/contact" style={{ color: "#30B0B0", textDecoration: "none" }}>drop us a message</a> instead.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className={"flex mt-8 " + (step > 1 ? "justify-between" : "justify-end")}>
                    {step > 1 && (
                      <button type="button" onClick={back} className="neon-btn flex items-center gap-2 text-sm px-5 py-2.5">
                        <ChevronLeft size={16} /> Back
                      </button>
                    )}
                    {step < 4 && (
                      <button type="button" onClick={next} disabled={!canNext()} className="neon-btn-filled neon-btn flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed">
                        Next <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {status === "success" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Confirmation bar */}
                <div className="no-print flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: "rgba(48,176,176,0.08)", border: "1px solid rgba(48,176,176,0.25)" }}>
                  <CheckCircle size={20} className="text-[var(--swift-teal)] flex-shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">Quote Request Sent!</p>
                    <p className="text-gray-400 text-xs mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>Confirmation sent to</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide break-all" style={{ background: "rgba(48,176,176,0.15)", border: "1px solid rgba(48,176,176,0.35)", color: "#30B0B0" }}>{form.email}</span>
                      <span>· We&apos;ll be in touch within 24 hours.</span>
                    </p>
                  </div>
                </div>

                {/* Quote Document */}
                <div id="quote-preview" className="rounded-2xl overflow-hidden text-sm" style={{ background: "#fff", color: "#101010" }}>
                  {/* Header */}
                  <div style={{ background: "#101010", padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <div style={{ color: "#30B0B0", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "2px", fontFamily: "Orbitron, sans-serif" }}>SWIFT DESIGNZ</div>
                      <div style={{ color: "#507070", fontSize: "0.7rem", marginTop: "0.3rem" }}>Software · Web · Apps · AI Training · PM Training</div>
                      <div style={{ color: "#444", fontSize: "0.7rem", marginTop: "0.15rem" }}>info@swiftdesignz.co.za · swiftdesignz.co.za</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#30B0B0", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "3px" }}>QUOTATION</div>
                      <div style={{ color: "#888", fontSize: "0.7rem", marginTop: "0.4rem" }}>Ref: <span style={{ color: "#fff" }}>{quoteRef}</span></div>
                      <div style={{ color: "#888", fontSize: "0.7rem" }}>Date: <span style={{ color: "#fff" }}>{new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</span></div>
                      <div style={{ color: "#888", fontSize: "0.7rem" }}>Valid: <span style={{ color: "#fff" }}>30 days</span></div>
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "2rem 2.5rem" }}>

                    {/* Prepared for */}
                    <QuoteSection title="Prepared For" />
                    <table style={{ width: "100%", marginBottom: "1.75rem", borderCollapse: "collapse" }}>
                      <tbody>
                        <QuoteRow label="Name" value={form.name} />
                        {form.company && <QuoteRow label="Company" value={form.company} />}
                        <QuoteRow label="Email" value={form.email} />
                        {form.phone && <QuoteRow label="Phone" value={form.phone} />}
                        {form.location && <QuoteRow label="Location" value={form.location} />}
                      </tbody>
                    </table>

                    {/* Service */}
                    <QuoteSection title="Service Requested" />
                    <table style={{ width: "100%", marginBottom: "1.75rem", borderCollapse: "collapse", border: "1px solid #e8e8e8" }}>
                      <thead style={{ background: "#f5f5f5" }}>
                        <tr>
                          <th style={QTH}>Service</th>
                          <th style={QTH}>Package</th>
                          <th style={{ ...QTH, textAlign: "right" }}>Starting Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={QTD}>{SERVICES.find(s => s.id === form.service)?.label ?? form.service}</td>
                          <td style={QTD}>
                            <strong>{PACKAGES[form.service as ServiceId]?.find(p => p.id === form.package)?.label ?? form.package}</strong>
                            <div style={{ fontSize: "0.75rem", color: "#666", marginTop: "2px" }}>
                              {PACKAGES[form.service as ServiceId]?.find(p => p.id === form.package)?.desc}
                            </div>
                          </td>
                          <td style={{ ...QTD, textAlign: "right", fontWeight: 700, color: "#30B0B0", whiteSpace: "nowrap", fontSize: "1rem" }}>
                            {PACKAGES[form.service as ServiceId]?.find(p => p.id === form.package)?.price || "Custom"}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Features */}
                    {form.features.length > 0 && (
                      <>
                        <QuoteSection title="Requested Features" />
                        <ul style={{ margin: "0 0 1.75rem 1.25rem", padding: 0, lineHeight: "1.9", color: "#333" }}>
                          {form.features.map(f => <li key={f}>{f}</li>)}
                        </ul>
                      </>
                    )}

                    {/* Design Preferences */}
                    {(form.lookFeel.length > 0 || form.themes.length > 0 || form.keywords.length > 0) && (
                      <>
                        <QuoteSection title="Design Preferences" />
                        <div style={{ marginBottom: "1.75rem" }}>
                          {form.lookFeel.length > 0 && (
                            <div style={{ marginBottom: "0.6rem" }}>
                              <span style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginRight: "0.5rem" }}>Look &amp; Feel:</span>
                              {form.lookFeel.map(t => <QuoteChip key={t}>{t}</QuoteChip>)}
                            </div>
                          )}
                          {form.themes.length > 0 && (
                            <div style={{ marginBottom: "0.6rem" }}>
                              <span style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginRight: "0.5rem" }}>Colour Theme:</span>
                              {form.themes.map(t => <QuoteChip key={t}>{t}</QuoteChip>)}
                            </div>
                          )}
                          {form.keywords.length > 0 && (
                            <div style={{ marginBottom: "0.6rem" }}>
                              <span style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", marginRight: "0.5rem" }}>Brand Vibe:</span>
                              {form.keywords.map(t => <QuoteChip key={t}>{t}</QuoteChip>)}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Project Scope */}
                    <QuoteSection title="Project Description" />
                    <div style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem", background: "#f8fefe", borderLeft: "3px solid #30B0B0", borderRadius: "2px", lineHeight: "1.75", color: "#333" }}>
                      {form.scope}
                    </div>

                    {/* Additional Details */}
                    {(form.timeline || form.budget || form.contentReady || form.referenceUrls) && (
                      <>
                        <QuoteSection title="Additional Details" />
                        <table style={{ width: "100%", marginBottom: "1.75rem", borderCollapse: "collapse" }}>
                          <tbody>
                            {form.timeline && <QuoteRow label="Timeline" value={form.timeline} />}
                            {form.budget && <QuoteRow label="Budget Range" value={form.budget} />}
                            {form.contentReady && <QuoteRow label="Content ready?" value={form.contentReady} />}
                            {form.referenceUrls && <QuoteRow label="Reference URLs" value={form.referenceUrls} />}
                          </tbody>
                        </table>
                      </>
                    )}

                    {/* Notes */}
                    {form.notes && (
                      <>
                        <QuoteSection title="Additional Notes" />
                        <p style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem", background: "#f9f9f9", borderRadius: "4px", lineHeight: "1.75", color: "#555" }}>
                          {form.notes}
                        </p>
                      </>
                    )}

                    {/* Proposed Plan */}
                    {(() => {
                      const phases = buildPlan(form.service, form.package);
                      if (phases.length === 0) return null;
                      return (
                        <>
                          <QuoteSection title="Proposed Project Plan" />
                          <p style={{ fontSize: "0.72rem", color: "#777", marginBottom: "0.9rem", lineHeight: "1.6" }}>
                            Based on your selection, here is a suggested project roadmap. Timelines are estimates and will be confirmed during our initial consultation.
                          </p>
                          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem", border: "1px solid #e0f0f0" }}>
                            <thead style={{ background: "#f0fafa" }}>
                              <tr>
                                <th style={{ ...QTH, width: "32px", textAlign: "center" }}>#</th>
                                <th style={QTH}>Phase</th>
                                <th style={{ ...QTH, whiteSpace: "nowrap" }}>Duration</th>
                                <th style={QTH}>Deliverable</th>
                              </tr>
                            </thead>
                            <tbody>
                              {phases.map((ph, i) => (
                                <tr key={i}>
                                  <td style={{ ...QTD, textAlign: "center", fontWeight: 700, color: "#30B0B0", fontSize: "0.85rem" }}>{i + 1}</td>
                                  <td style={QTD}>
                                    <div style={{ fontWeight: 600, color: "#111", fontSize: "0.78rem" }}>{ph.title}</div>
                                    <div style={{ color: "#666", fontSize: "0.72rem", marginTop: "2px", lineHeight: "1.5" }}>{ph.desc}</div>
                                  </td>
                                  <td style={{ ...QTD, whiteSpace: "nowrap", color: "#30B0B0", fontSize: "0.72rem", fontWeight: 600 }}>{ph.duration}</td>
                                  <td style={{ ...QTD, color: "#555", fontSize: "0.72rem", lineHeight: "1.5" }}>{ph.deliverable}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      );
                    })()}

                    {/* Pricing note */}
                    <div style={{ marginBottom: "2rem", padding: "0.9rem 1.1rem", background: "#fffbe6", border: "1px solid #f0d060", borderLeft: "3px solid #d4aa20", borderRadius: "6px", fontSize: "0.75rem", color: "#7a6010", lineHeight: "1.65" }}>
                      <strong style={{ color: "#a07800" }}>&#9432; Pricing Note:</strong> All prices shown are starting rates only. The final cost will be determined based on your specific requirements, complexity, and any additional features or customisations requested. A detailed, itemised quote will be provided after your initial consultation.
                    </div>

                    {/* Footer */}
                    <div style={{ borderTop: "1px solid #eee", paddingTop: "1.25rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem", fontSize: "0.72rem", color: "#999" }}>
                      <div><strong style={{ color: "#30B0B0" }}>Swift Designz</strong> · swiftdesignz.co.za</div>
                      <div>info@swiftdesignz.co.za</div>
                      <div>Valid 30 days from {new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="no-print flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => { setStatus("idle"); setStep(1); setForm(INITIAL); setQuoteRef(""); }}
                    className="neon-btn-filled neon-btn flex items-center gap-2 text-sm px-5 py-2.5"
                  >
                    New Quote
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

function SummaryRow({ label, value, highlight = false, chip = false }: { label: string; value: string; highlight?: boolean; chip?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-500 uppercase text-[10px] tracking-wider w-14 flex-shrink-0 pt-0.5">{label}</span>
      {highlight ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide break-all min-w-0 max-w-full" style={{ background: "rgba(48,176,176,0.15)", border: "1px solid rgba(48,176,176,0.35)", color: "#30B0B0" }}>{value}</span>
      ) : chip ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide capitalize" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#e0e0e0" }}>{value}</span>
      ) : (
        <span className="text-sm text-white min-w-0 break-all">{value}</span>
      )}
    </div>
  );
}

// ─── QUOTE PREVIEW HELPERS ───────────────────────────────────────────────────

const QTH: React.CSSProperties = {
  padding: "0.6rem 0.9rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem",
  textTransform: "uppercase", letterSpacing: "0.05em", color: "#555",
  borderBottom: "1px solid #e0e0e0",
};

const QTD: React.CSSProperties = {
  padding: "0.75rem 0.9rem", verticalAlign: "top", borderBottom: "1px solid #f0f0f0", color: "#222",
  wordBreak: "break-all", overflowWrap: "anywhere",
};

function QuoteSection({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "#30B0B0" }}>{title}</span>
      <div style={{ flex: 1, height: "1px", background: "#e8e8e8" }} />
    </div>
  );
}

function QuoteRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ ...QTD, color: "#888", fontSize: "0.75rem", width: "130px", whiteSpace: "nowrap" }}>{label}</td>
      <td style={QTD}>{value}</td>
    </tr>
  );
}

function QuoteChip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block", margin: "2px 3px", padding: "2px 10px",
      background: "#e8fafa", border: "1px solid #a0d8d8", borderRadius: "20px",
      fontSize: "0.72rem", color: "#1a6060", fontWeight: 500,
    }}>
      {children}
    </span>
  );
}