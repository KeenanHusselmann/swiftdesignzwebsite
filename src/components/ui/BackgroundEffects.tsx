"use client";

import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <>
      {/* Grid */}
      <div className="bg-grid" />

      {/* Floating Orbs */}
      <motion.div
        className="orb orb-teal"
        style={{ width: 400, height: 400, top: "10%", left: "-5%" }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-deep"
        style={{ width: 300, height: 300, top: "60%", right: "-5%" }}
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="orb orb-teal"
        style={{ width: 200, height: 200, bottom: "10%", left: "30%" }}
        animate={{
          x: [0, 60, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}
