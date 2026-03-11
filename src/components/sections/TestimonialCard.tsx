"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  delay?: number;
}

export default function TestimonialCard({ quote, name, role, delay = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="glass glass-hover p-5 md:p-8 relative"
    >
      <Quote
        size={32}
        className="absolute top-6 right-6 opacity-10"
        color="var(--swift-teal)"
      />
      <p className="text-gray-300 leading-relaxed mb-6 italic">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, var(--swift-teal), var(--swift-deep))",
          }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}
