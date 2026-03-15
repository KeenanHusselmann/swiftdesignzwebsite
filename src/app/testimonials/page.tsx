"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, startTransition } from "react";
import Link from "next/link";
import TestimonialCard from "@/components/sections/TestimonialCard";
import { useI18n } from "@/i18n/I18nProvider";

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
    role: "Project Manager — Ambrose Isaacs",
  },
  {
    quote:
      "This is soooo beautiful. I am speechless. The colours, the feel — you got it all. I love this now... it speaks of hope, new mercies in the morning. You are truly blessed with a great gift.",
    name: "Ruth Gwasira",
    role: "Client — Ruby's Faith Jewellery",
  },
  {
    quote:
      "Ek kan nie glo dis my shop nie. Alles is baie smart. Dis 'n great 'shoppers' website! Baie dankie vir die goeie navorsing wat jy gedoen het by die beskrywings. Ek is oorweldig!",
    name: "Yvonne Steenkamp",
    role: "Client — Fryse",
  },
];

export default function TestimonialsPage() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true });
  const [activeTIdx, setActiveTIdx] = useState(-1);

  useEffect(() => {
    if (inView && activeTIdx === -1) startTransition(() => setActiveTIdx(0));
  }, [inView, activeTIdx]);

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
            <span className="text-xs tracking-[4px] uppercase text-[#b45309]">
              {t("testimonialsPage.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              {t("testimonialsPage.title")}{" "}
              <span className="text-gradient">{t("testimonialsPage.titleHighlight")}</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              {t("testimonialsPage.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="section" ref={sectionRef}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((item, i) => (
              <TestimonialCard
                key={i}
                quote={item.quote}
                name={item.name}
                role={item.role}
                delay={i * 0.1}
                isActive={activeTIdx === i}
                isPending={activeTIdx >= 0 && activeTIdx < i}
                onDone={() =>
                  setActiveTIdx(i < testimonials.length - 1 ? i + 1 : i)
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("testimonialsPage.ctaTitle")}{" "}
              <span className="text-gradient">{t("testimonialsPage.ctaHighlight")}</span>
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              {t("testimonialsPage.ctaDesc")}
            </p>
            <Link href="/quote" className="neon-btn-filled neon-btn">
              {t("testimonialsPage.ctaBtn")}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
