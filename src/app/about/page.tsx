"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Code2,
  Globe,
  Smartphone,
  Target,
  Heart,
  Lightbulb,
  Users,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const timeline = [
  {
    year: "Education",
    title: "Software Development Degree",
    desc: "Completed a comprehensive degree in Software Development, building a strong foundation in programming, architecture, and modern development practices.",
    icon: GraduationCap,
  },
  {
    year: "2+ Years",
    title: "Web Development & E-Commerce",
    desc: "Built custom websites and online stores for businesses across South Africa, delivering stunning designs that drive results.",
    icon: Globe,
  },
  {
    year: "1+ Year",
    title: "Apps & Software Development",
    desc: "Expanded into mobile applications and custom software solutions, helping businesses streamline operations and reach more customers.",
    icon: Smartphone,
  },
];

const values = [
  {
    icon: Target,
    title: "Ownership",
    desc: "Every project is treated as if it were our own. We take full responsibility from concept to delivery.",
  },
  {
    icon: Heart,
    title: "Passion",
    desc: "We genuinely love what we do. That passion shows in every pixel, every line of code, and every interaction.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We stay ahead of the curve, using the latest technologies and design trends to give your brand an edge.",
  },
  {
    icon: Users,
    title: "Collaboration",
    desc: "Your vision drives the project. We work closely with you, ensuring every detail aligns with your goals.",
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

export default function AboutPage() {
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
              About Swift Designz
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              The Story Behind{" "}<br></br>
              
              <span className="text-gradient">The Code</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Swift Designz is a freelance software development studio
              dedicated to helping people get their brand, product, and service out
              there in a creative and aesthetic way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
                Our Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">
                Making Your <span className="text-gradient">Vision Real</span>
              </h2>
              <div className="section-divider" />
              <p className="text-gray-400 mt-6 mb-4 leading-relaxed">
                We believe every brand deserves a digital presence that truly represents who they are.
                Not a cookie-cutter template. Not a generic layout. Something that breathes
                your identity and speaks to your audience.
              </p>
              <p className="text-gray-400 leading-relaxed">
                With over two years of experience building
                websites and e-commerce stores, and growing expertise in apps and software,
                Swift Designz delivers fast, elegant, and creative digital solutions
                that make YOUR business stand out.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-6 md:p-8 relative overflow-hidden"
            >
              <div className="scan-line absolute inset-0 pointer-events-none" />
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">2+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Years Experience
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">BSc</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Software Dev Degree
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">15+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Projects Delivered
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient mb-2">100%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Client Satisfaction
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              The Journey
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Experience & <span className="text-gradient">Growth</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass glass-hover p-5 md:p-8 relative"
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(48, 176, 176, 0.1)" }}
                  >
                    <item.icon size={22} color="var(--swift-teal)" />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--swift-teal)] tracking-[2px] uppercase font-semibold">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                {/* Connector line */}
                {i < timeline.length - 1 && (
                  <div
                    className="absolute left-[2.95rem] top-full w-[1px] h-8"
                    style={{ background: "rgba(48, 176, 176, 0.15)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <div className="section-divider mx-auto" />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {values.map((value, i) => (
              <motion.div key={i} variants={itemVariants} className="glass glass-hover p-6 md:p-8">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(48, 176, 176, 0.08)" }}
                >
                  <value.icon size={22} color="var(--swift-teal)" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
              Let&apos;s Work <span className="text-gradient">Together</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Ready to bring your digital vision to life? Let&apos;s chat about your
              project and create something extraordinary.
            </p>
            <Link href="/contact" className="neon-btn-filled neon-btn">
              Get In Touch
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
