"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

export default function QuotePage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [planeFly, setPlaneFly] = useState(false);
  const [planeKey, setPlaneKey] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");
    setPlaneKey((k) => k + 1);
    setPlaneFly(true);
    setTimeout(() => setPlaneFly(false), 1800);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formState, _type: "quote" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send quote request");
      }

      setStatus("success");
      setFormState({ name: "", email: "", phone: "", service: "", budget: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      {/* Flying plane overlay */}
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
            <Send
              size={36}
              color="var(--swift-teal)"
              style={{ filter: "drop-shadow(0 0 10px rgba(48,176,176,0.9))" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
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
                style={{
                  filter: "drop-shadow(0 0 12px rgba(48, 176, 176, 0.4)) drop-shadow(0 0 24px rgba(48, 176, 176, 0.2))",
                }}
              />
            </motion.div>
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              Get a Quote
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Let&apos;s Build <span className="text-gradient">Something</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Tell us about your project and we&apos;ll put together a tailored proposal.
              No obligations — just a conversation about what&apos;s possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section pt-4 pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            {/* Electric border wrapper */}
            <div className="relative rounded-2xl overflow-hidden" style={{ padding: "1.5px" }}>
              <div
                className="absolute"
                style={{
                  width: "300%",
                  height: "300%",
                  top: "-100%",
                  left: "-100%",
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, #30B0B0 60deg, #7ef5f5 120deg, transparent 180deg, transparent 240deg, #509090 300deg, transparent 360deg)",
                  animation: "spinElectric 6s linear infinite",
                }}
              />
            <form
              onSubmit={handleSubmit}
              className="relative rounded-[14px] space-y-6 p-6 md:p-8 lg:p-10"
              style={{ background: "#0a0f1a" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all"
                    style={{
                      background: "rgba(16, 16, 16, 0.6)",
                      border: "1px solid rgba(48, 176, 176, 0.1)",
                    }}
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all"
                    style={{
                      background: "rgba(16, 16, 16, 0.6)",
                      border: "1px solid rgba(48, 176, 176, 0.1)",
                    }}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formState.phone}
                    onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all"
                    style={{
                      background: "rgba(16, 16, 16, 0.6)",
                      border: "1px solid rgba(48, 176, 176, 0.1)",
                    }}
                    placeholder="+27 ..."
                  />
                </div>

                {/* Service */}
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Service Interested In
                  </label>
                  <select
                    value={formState.service}
                    onChange={(e) => setFormState((s) => ({ ...s, service: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all appearance-none cursor-pointer"
                    style={{
                      background: "rgba(16, 16, 16, 0.6)",
                      border: "1px solid rgba(48, 176, 176, 0.1)",
                    }}
                  >
                    <option value="" style={{ background: "#101010" }}>Select a service</option>
                    <option value="website" style={{ background: "#101010" }}>Website Development</option>
                    <option value="ecommerce" style={{ background: "#101010" }}>E-Commerce Store</option>
                    <option value="app" style={{ background: "#101010" }}>App / Software</option>
                    <option value="pm-training" style={{ background: "#101010" }}>Project Management Training</option>
                    <option value="ai-training" style={{ background: "#101010" }}>AI Training</option>
                    <option value="other" style={{ background: "#101010" }}>Other</option>
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Estimated Budget
                </label>
                <select
                  value={formState.budget}
                  onChange={(e) => setFormState((s) => ({ ...s, budget: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all appearance-none cursor-pointer"
                  style={{
                    background: "rgba(16, 16, 16, 0.6)",
                    border: "1px solid rgba(48, 176, 176, 0.1)",
                  }}
                >
                  <option value="" style={{ background: "#101010" }}>Select your budget range</option>
                  <option value="R2500-R5000" style={{ background: "#101010" }}>R2,500 - R5,000</option>
                  <option value="R5000-R10000" style={{ background: "#101010" }}>R5,000 - R10,000</option>
                  <option value="R10000-R25000" style={{ background: "#101010" }}>R10,000 - R25,000</option>
                  <option value="R25000+" style={{ background: "#101010" }}>R25,000+</option>
                  <option value="not-sure" style={{ background: "#101010" }}>Not sure yet</option>
                </select>
              </div>

              {/* Project details */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Tell Us About Your Project *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--swift-teal)] transition-all resize-none"
                  style={{
                    background: "rgba(16, 16, 16, 0.6)",
                    border: "1px solid rgba(48, 176, 176, 0.1)",
                  }}
                  placeholder="Describe your project, goals, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="neon-btn-filled neon-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle size={16} />
                    Sent!
                  </>
                ) : (
                  <>
                    Send Quote Request
                    <Send size={16} />
                  </>
                )}
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-lg"
                  style={{
                    background: "rgba(48, 176, 176, 0.08)",
                    border: "1px solid rgba(48, 176, 176, 0.2)",
                  }}
                >
                  <CheckCircle size={18} color="var(--swift-teal)" />
                  <p className="text-sm text-[var(--swift-teal)]">
                    Quote request sent! We&apos;ll get back to you with a proposal within 24 hours.
                  </p>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-lg"
                  style={{
                    background: "rgba(255, 100, 100, 0.08)",
                    border: "1px solid rgba(255, 100, 100, 0.2)",
                  }}
                >
                  <AlertCircle size={18} color="#ff6464" />
                  <p className="text-sm text-[#ff6464]">{errorMessage}</p>
                </motion.div>
              )}
            </form>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
