"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const jokes = [
  "Why don't eggs tell jokes? They'd crack each other up.",
  "I told my suitcase there will be no vacations this year. Now it has emotional baggage.",
  "Why did the scarecrow win an award? He was outstanding in his field.",
  "I only know 25 letters of the alphabet. I don't know y.",
  "Why don't scientists trust atoms? Because they make up everything.",
  "My math teacher called me average. How mean.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "I used to play piano by ear, but now I use my hands.",
  "Why did the coffee file a police report? It got mugged.",
  "What kind of shoes do ninjas wear? Sneakers.",
  "Why do programmers avoid nature? Too many bugs.",
  "A programmer's favorite place to relax is the Foo Bar.",
];

const funFacts = [
  "Honey never spoils. Pots of honey found in ancient tombs were still edible.",
  "Bananas are berries, but strawberries are not.",
  "Octopuses have three hearts and blue blood.",
  "A day on Venus is longer than a year on Venus.",
  "Sharks existed before trees.",
  "The Eiffel Tower can grow taller in summer due to heat expansion.",
  "Your nose can remember tens of thousands of different scents.",
  "Hot water can freeze faster than cold water in some situations. It is called the Mpemba effect.",
  "Koala fingerprints can look surprisingly similar to human fingerprints.",
  "The shortest war in history lasted less than an hour.",
  "The first website is still online at info.cern.ch.",
  "Wombat poop is cube-shaped, which helps stop it from rolling away.",
];

const mascotLines = [
  "Hey there! Just checking in. Keep scrolling, this site is amazing.",
  "Psst... Swift Designz makes really cool stuff. Just saying.",
  "Did you know? Keenan once debugged a production issue at 2am. Dedication!",
  "Fun fact: This website was crafted with love, coffee, and a lot of CSS.",
  "I'm Swifty. I live here. Isn't this site gorgeous?",
  "You look like someone who appreciates good design. Welcome!",
  "Pro tip: Check out the Packages page. Some great deals there.",
  "I bet you're here because someone told you how great Swift Designz is.",
];

type PopupContent = {
  type: "joke" | "fact" | "mascot";
  text: string;
};

export default function FunButton() {
  const [popup, setPopup] = useState<PopupContent | null>(null);
  const [isWinking, setIsWinking] = useState(false);

  const pickRandom = useCallback((items: string[], exclude?: string) => {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];

    let selected = items[Math.floor(Math.random() * items.length)];
    let attempts = 0;

    // Avoid showing the same line twice in a row when possible.
    while (selected === exclude && attempts < 8) {
      selected = items[Math.floor(Math.random() * items.length)];
      attempts += 1;
    }

    return selected;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerFun = useCallback(() => {
    const roll = Math.random();

    setPopup((current) => {
      if (roll < 0.3) {
        return {
          type: "joke",
          text: pickRandom(jokes, current?.text),
        };
      }

      if (roll < 0.75) {
        return {
          type: "fact",
          text: pickRandom(funFacts, current?.text),
        };
      }

      return {
        type: "mascot",
        text: pickRandom(mascotLines, current?.text),
      };
    });
  }, [pickRandom]);

  return (
    <>
      {/* Fun trigger button */}
      <motion.button
        onClick={triggerFun}
        className="fixed bottom-6 left-4 sm:left-6 z-[150] p-3.5 rounded-full cursor-pointer"
        style={{
          background: "rgba(10, 18, 18, 0.72)",
          border: "1px solid rgba(217, 119, 6, 0.45)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        animate={{
          boxShadow: [
            "0 0 8px rgba(217, 119, 6, 0.2), 0 0 16px rgba(217, 119, 6, 0.1)",
            "0 0 16px rgba(217, 119, 6, 0.4), 0 0 32px rgba(217, 119, 6, 0.2)",
            "0 0 8px rgba(217, 119, 6, 0.2), 0 0 16px rgba(217, 119, 6, 0.1)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{
          scale: 1.15,
          boxShadow: "0 0 24px rgba(217, 119, 6, 0.5), 0 0 48px rgba(217, 119, 6, 0.25)",
        }}
        whileTap={{ scale: 0.9 }}
        title="Click for something fun!"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="amberFace" cx="38%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>
          <circle cx="12" cy="12" r="10" fill="url(#amberFace)" />
          {/* Left eye - winks */}
          {isWinking ? (
            <path d="M7 10 Q8.5 11.5 10 10" stroke="#1c0a00" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : (
            <circle cx="8.5" cy="10" r="1.5" fill="#1c0a00" />
          )}
          {/* Right eye */}
          <circle cx="15.5" cy="10" r="1.5" fill="#1c0a00" />
          {/* Smile */}
          <path d="M8 14.5 Q12 18 16 14.5" stroke="#1c0a00" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      </motion.button>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-20 left-4 sm:left-6 z-[151] max-w-[calc(100vw-2rem)] sm:max-w-sm"
          >
            <div
              className="p-5 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #050d1a 0%, #0d1f35 50%, #050d1a 100%)",
                border: "1px solid rgba(48, 176, 176, 0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Mascot avatar for mascot type */}
              {popup.type === "mascot" && (
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/favicon.png"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    style={{ filter: "drop-shadow(0 0 6px rgba(48,176,176,0.7))" }}
                    alt="Swifty"
                  />
                  <span className="text-xs font-semibold text-[var(--swift-teal)] tracking-wider uppercase">
                    Swifty says
                  </span>
                </div>
              )}

              {/* Label */}
              {popup.type === "joke" && (
                <div className="text-[10px] uppercase tracking-[3px] text-[var(--swift-teal)] mb-2 font-semibold">
                  Random Joke
                </div>
              )}
              {popup.type === "fact" && (
                <div className="text-[10px] uppercase tracking-[3px] text-[var(--swift-muted)] mb-2 font-semibold">
                  Did You Know?
                </div>
              )}

              <p className="text-sm text-gray-300 leading-relaxed">{popup.text}</p>

              {/* Close */}
              <button
                onClick={() => setPopup(null)}
                className="absolute top-2 right-3 text-gray-600 hover:text-white text-xs"
              >
                &times;
              </button>

              {/* Neon accent */}
              <div
                className="absolute -bottom-px left-4 right-4 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--swift-teal), transparent)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
