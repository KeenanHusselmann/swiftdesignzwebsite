"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
  "Why did the developer go broke? Because he used up all his cache.",
  "!false - It's funny because it's true.",
  "What's a programmer's favourite hangout spot? Foo Bar.",
  "How many programmers does it take to change a light bulb? None. That's a hardware problem.",
  "Why do Java developers wear glasses? Because they can't C#.",
  "What did the router say to the doctor? 'It hurts when IP.'",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
  "A programmer's wife tells him: 'Go to the store and buy a loaf of bread. If they have eggs, buy a dozen.' He comes home with 12 loaves.",
  "The best thing about a Boolean is that even if you're wrong, you're only off by a bit.",
];

const funFacts = [
  "The first computer programmer was Ada Lovelace, way back in the 1840s.",
  "The first computer virus was created in 1983 and was called the 'Elk Cloner'.",
  "About 70% of all coding jobs are in fields outside of tech.",
  "The average person checks their phone 96 times a day. That's once every 10 minutes.",
  "NASA's Apollo 11 guidance computer had only 74 KB of memory.",
  "The first website is still online: info.cern.ch",
  "Python is named after Monty Python, not the snake.",
  "There are about 700 different programming languages.",
  "The first domain ever registered was symbolics.com on March 15, 1985.",
  "Samsung tests phone durability with a robot shaped like a human butt.",
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

  const triggerFun = useCallback(() => {
    const roll = Math.random();
    let content: PopupContent;

    if (roll < 0.4) {
      content = {
        type: "joke",
        text: jokes[Math.floor(Math.random() * jokes.length)],
      };
    } else if (roll < 0.7) {
      content = {
        type: "fact",
        text: funFacts[Math.floor(Math.random() * funFacts.length)],
      };
    } else {
      content = {
        type: "mascot",
        text: mascotLines[Math.floor(Math.random() * mascotLines.length)],
      };
    }

    setPopup(content);
    setTimeout(() => setPopup(null), 5000);
  }, []);

  return (
    <>
      {/* Fun trigger button */}
      <motion.button
        onClick={triggerFun}
        className="fixed bottom-6 left-6 z-[150] p-3 rounded-full cursor-pointer"
        style={{
          background: "rgba(48, 176, 176, 0.1)",
          border: "1px solid rgba(48, 176, 176, 0.2)",
          backdropFilter: "blur(10px)",
        }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 0 20px rgba(48, 176, 176, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
        title="Click for something fun!"
      >
        <Sparkles size={20} color="var(--swift-teal)" />
      </motion.button>

      {/* Popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-20 left-6 z-[151] max-w-sm"
          >
            <div
              className="glass-strong p-5 rounded-2xl relative"
              style={{ border: "1px solid rgba(48, 176, 176, 0.2)" }}
            >
              {/* Mascot avatar for mascot type */}
              {popup.type === "mascot" && (
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--swift-teal), var(--swift-deep))",
                    }}
                  >
                    {/* Simple mascot face - octopus-inspired */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="10" r="8" fill="rgba(255,255,255,0.9)" />
                      <circle cx="9" cy="9" r="1.5" fill="var(--swift-black)" />
                      <circle cx="15" cy="9" r="1.5" fill="var(--swift-black)" />
                      <path
                        d="M9 13 C10 15 14 15 15 13"
                        stroke="var(--swift-black)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path d="M4 18 Q2 22 4 22" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 18 Q7 22 9 22" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M16 18 Q17 22 15 22" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M20 18 Q22 22 20 22" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
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
