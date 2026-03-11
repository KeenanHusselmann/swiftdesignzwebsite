"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function ContactPage() {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
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
              Contact
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Let&apos;s <span className="text-gradient">Talk</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Have a project in mind? Need a quote? Or just want to say hello?
              We&apos;d love to hear from you. Fill out the form below and we&apos;ll
              get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass glass-hover p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(48, 176, 176, 0.1)" }}
                  >
                    <Mail size={18} color="var(--swift-teal)" />
                  </div>
                  <h3 className="font-semibold text-sm">Email Us</h3>
                </div>
                <a
                  href="mailto:info@swiftdesignz.co.za"
                  className="text-sm text-gray-400 hover:text-[var(--swift-teal)] transition-colors block mb-1"
                >
                  info@swiftdesignz.co.za
                </a>
                <a
                  href="mailto:keenan@swiftdesignz.co.za"
                  className="text-sm text-gray-400 hover:text-[var(--swift-teal)] transition-colors block"
                >
                  keenan@swiftdesignz.co.za
                </a>
              </div>

              <div className="glass glass-hover p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(48, 176, 176, 0.1)" }}
                  >
                    <MapPin size={18} color="var(--swift-teal)" />
                  </div>
                  <h3 className="font-semibold text-sm">Location</h3>
                </div>
                <p className="text-sm text-gray-400">South Africa</p>
                <p className="text-xs text-gray-600 mt-1">Available for remote projects worldwide</p>
              </div>

              <div className="glass glass-hover p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(48, 176, 176, 0.1)" }}
                  >
                    <Clock size={18} color="var(--swift-teal)" />
                  </div>
                  <h3 className="font-semibold text-sm">Response Time</h3>
                </div>
                <p className="text-sm text-gray-400">Within 24 hours</p>
                <p className="text-xs text-gray-600 mt-1">
                  Mon - Fri: 8:00 - 18:00 SAST
                </p>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <form
                onSubmit={handleSubmit}
                className="glass-strong p-6 md:p-8 lg:p-10 rounded-2xl space-y-6"
                style={{ border: "1px solid rgba(48, 176, 176, 0.1)" }}
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

                {/* Message */}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="neon-btn-filled neon-btn w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
                    </>
                  )}
                </button>

                {/* Status Messages */}
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
                      Message sent successfully! We&apos;ll be in touch within 24 hours.
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
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
