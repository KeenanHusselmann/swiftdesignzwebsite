"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  delay?: number;
  isActive: boolean;
  isPending: boolean;
  onDone: () => void;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  delay = 0,
  isActive,
  isPending,
  onDone,
}: TestimonialCardProps) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);

  // Keep onDoneRef current without it being a dep in the timeout effect
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Reset doneRef when this card becomes active
  useEffect(() => {
    if (isActive) doneRef.current = false;
  }, [isActive]);

  // Typing loop — 55ms per character
  useEffect(() => {
    if (!isActive || displayed.length >= quote.length) return;
    const t = setTimeout(() => {
      setDisplayed(quote.slice(0, displayed.length + 1));
    }, 55);
    return () => clearTimeout(t);
  }, [isActive, displayed, quote]);

  // Fire onDone once when typing completes — onDone via ref so no dep-array cancellation
  useEffect(() => {
    if (!isActive || displayed.length < quote.length || doneRef.current) return;
    doneRef.current = true;
    const t = setTimeout(() => onDoneRef.current(), 400);
    return () => clearTimeout(t);
  }, [isActive, displayed, quote]);

  const done = displayed.length >= quote.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5, boxShadow: "0 12px 40px rgba(217,119,6,0.2), 0 4px 32px rgba(0,0,0,0.4)", transition: { duration: 0.25 } }}
      className="relative flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(12, 8, 2, 0.55)",
        backdropFilter: "blur(20px) saturate(1.5)",
        WebkitBackdropFilter: "blur(20px) saturate(1.5)",
        border: "1px solid rgba(217,119,6,0.22)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(252,211,77,0.08)",
      }}
    >
      {/* Amber top accent bar */}
      <div
        className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg, #d97706, #f59e0b, #fcd34d, transparent)" }}
      />

      <div className="p-5 md:p-7 flex flex-col h-full">
        {/* Quote icon */}
        <Quote size={28} className="mb-4 flex-shrink-0" color="#d97706" style={{ opacity: 0.75 }} />

        {/* Text area — fixed min height so cards don't collapse */}
        <div className="flex-1 flex items-start mb-6 min-h-[96px]">
          <AnimatePresence mode="wait">
            {isPending && !isActive ? (
              <motion.div
                key="pending"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full flex items-center justify-center"
              >
                <span
                  className="text-sm italic font-medium tracking-wide animate-pulse"
                  style={{ color: "#d97706" }}
                >
                  Client typing
                  <span className="inline-flex gap-[3px] ml-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        .
                      </motion.span>
                    ))}
                  </span>
                </span>
              </motion.div>
            ) : (
              <motion.p
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-gray-300 leading-relaxed italic text-sm md:text-[0.9rem] font-medium"
              >
                &ldquo;{displayed}
                {!done && (
                  <span className="inline-block w-[2px] h-[1em] bg-[#d97706] ml-[1px] align-middle animate-pulse" />
                )}
                {done && "\u201d"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Amber divider */}
        <div
          className="h-px mb-4"
          style={{ background: "linear-gradient(90deg, #d97706 0%, rgba(217,119,6,0.08) 100%)" }}
        />

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #d97706, #92400e)",
              boxShadow: "0 0 12px rgba(217,119,6,0.4)",
            }}
          >
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-100">{name}</p>
            <p className="text-xs text-[#b45309]">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

