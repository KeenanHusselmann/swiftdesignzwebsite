"use client";

import { useEffect, useState } from "react";

// Products in the catalogue
const PRODUCTS = [
  { id: 1, emoji: "👟", name: "Sneakers", price: "R 899", color: "#fbbf24" },
  { id: 2, emoji: "🎧", name: "Headphones", price: "R 1 299", color: "#a78bfa" },
  { id: 3, emoji: "⌚", name: "Smart Watch", price: "R 2 499", color: "#34d399" },
  { id: 4, emoji: "💻", name: "Laptop Stand", price: "R 549", color: "#60a5fa" },
  { id: 5, emoji: "🎒", name: "Backpack", price: "R 749", color: "#f87171" },
  { id: 6, emoji: "📱", name: "Phone Case", price: "R 199", color: "#fb923c" },
];

// Phases: browse → hover → addToCart → cartSlide → checkout → success → (loop)
type Phase =
  | "browse"
  | "hover"
  | "addToCart"
  | "cartSlide"
  | "checkout"
  | "success";

const DELAYS: Record<Phase, number> = {
  browse:    1400,
  hover:     900,
  addToCart: 700,
  cartSlide: 1600,
  checkout:  800,
  success:   2200,
};

const NEXT: Record<Phase, Phase> = {
  browse:    "hover",
  hover:     "addToCart",
  addToCart: "cartSlide",
  cartSlide: "checkout",
  checkout:  "success",
  success:   "browse",
};

// Which product gets the spotlight — cycles through them
let spotlight = 0;

export default function EcommerceCheckoutSim() {
  const [phase, setPhase] = useState<Phase>("browse");
  const [active, setActive] = useState(2); // index in PRODUCTS
  const [cartCount, setCartCount] = useState(0);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (phase === "addToCart") {
        setCartCount((c) => c + 1);
        setCartBump(true);
        setTimeout(() => setCartBump(false), 400);
      }
      if (phase === "success") {
        // pick next product for next cycle
        spotlight = (spotlight + 1) % PRODUCTS.length;
        setActive(spotlight);
        setCartCount(0);
      }
      setPhase(NEXT[phase]);
    }, DELAYS[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  const prod = PRODUCTS[active];
  const cartOpen = phase === "cartSlide" || phase === "checkout" || phase === "success";
  const showSuccess = phase === "success";
  const isHovered = phase === "hover" || phase === "addToCart";

  return (
    <div
      className="rounded-2xl overflow-hidden select-none"
      style={{
        border: "1px solid rgba(48,176,176,0.18)",
        boxShadow: "0 0 40px rgba(48,176,176,0.06)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        fontSize: "12px",
      }}
    >
      {/* ── Browser chrome ── */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
        {/* URL bar */}
        <div
          className="flex-1 mx-3 rounded-full px-3 py-1 text-center"
          style={{
            background: "rgba(255,255,255,0.05)",
            color: "#7d8590",
            fontSize: "10px",
            letterSpacing: "0.3px",
          }}
        >
          shop.swiftdesignz.co.za
        </div>
        {/* Cart badge */}
        <div className="relative" style={{ transition: "transform 0.2s", transform: cartBump ? "scale(1.4)" : "scale(1)" }}>
          <span style={{ fontSize: "16px" }}>🛒</span>
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background: "#30B0B0",
                color: "#000",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
      </div>

      {/* ── Store nav ── */}
      <div
        className="flex items-center gap-4 px-4 py-2"
        style={{ background: "#0d1117", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span style={{ color: "#30B0B0", fontWeight: 700, fontSize: "13px" }}>ShopZone</span>
        {["All", "Electronics", "Clothing", "Bags"].map((c) => (
          <span
            key={c}
            style={{
              color: c === "All" ? "#30B0B0" : "#7d8590",
              fontSize: "10px",
              cursor: "pointer",
              borderBottom: c === "All" ? "1px solid #30B0B0" : "none",
              paddingBottom: "1px",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* ── Main area ── */}
      <div className="relative" style={{ background: "#0a0f1a", minHeight: "18rem" }}>
        {/* Product grid */}
        <div
          className="grid grid-cols-3 gap-2 p-3"
          style={{
            transition: "filter 0.4s, opacity 0.4s",
            filter: cartOpen ? "blur(1px)" : "none",
            opacity: cartOpen ? 0.4 : 1,
          }}
        >
          {PRODUCTS.map((p, i) => {
            const isActive = i === active;
            const hovered = isActive && isHovered;
            return (
              <div
                key={p.id}
                className="rounded-xl p-2 flex flex-col items-center gap-1"
                style={{
                  background: hovered
                    ? `linear-gradient(135deg, rgba(48,176,176,0.12), rgba(48,176,176,0.04))`
                    : "rgba(255,255,255,0.03)",
                  border: hovered
                    ? `1px solid rgba(48,176,176,0.5)`
                    : isActive
                    ? `1px solid rgba(48,176,176,0.15)`
                    : "1px solid rgba(255,255,255,0.04)",
                  transform: hovered ? "scale(1.04) translateY(-2px)" : "none",
                  transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: hovered ? `0 6px 24px rgba(48,176,176,0.15)` : "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>{p.emoji}</span>
                <span style={{ color: "#d4d4d4", fontSize: "9px", fontWeight: 600, textAlign: "center" }}>
                  {p.name}
                </span>
                <span style={{ color: p.color, fontSize: "9px", fontWeight: 700 }}>{p.price}</span>
                <div
                  className="w-full rounded-md py-0.5 text-center mt-1"
                  style={{
                    background: hovered ? "#30B0B0" : "rgba(48,176,176,0.1)",
                    color: hovered ? "#000" : "#30B0B0",
                    fontSize: "8px",
                    fontWeight: 700,
                    transition: "all 0.25s",
                    transform: phase === "addToCart" && isActive ? "scale(0.92)" : "scale(1)",
                  }}
                >
                  {phase === "addToCart" && isActive ? "Adding..." : "Add to Cart"}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Slide-in Cart Panel ── */}
        <div
          className="absolute inset-y-0 right-0 flex flex-col"
          style={{
            width: "55%",
            background: "linear-gradient(160deg, #161b22 0%, #0d1117 100%)",
            borderLeft: "1px solid rgba(48,176,176,0.2)",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.6)",
            transform: cartOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.32,0.72,0,1)",
            padding: "12px",
          }}
        >
          {!showSuccess ? (
            <>
              <div style={{ color: "#30B0B0", fontWeight: 700, fontSize: "11px", marginBottom: "10px" }}>
                Your Cart (1 item)
              </div>

              {/* Cart item */}
              <div
                className="rounded-lg p-2 flex items-center gap-2 mb-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span style={{ fontSize: "24px" }}>{prod.emoji}</span>
                <div className="flex-1">
                  <div style={{ color: "#d4d4d4", fontSize: "10px", fontWeight: 600 }}>{prod.name}</div>
                  <div style={{ color: prod.color, fontSize: "9px" }}>{prod.price}</div>
                  <div style={{ color: "#7d8590", fontSize: "8px" }}>Qty: 1</div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", marginBottom: "8px" }}>
                {[["Subtotal", prod.price], ["Shipping", "R 0 FREE"], ["VAT (15%)", "R 134"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between" style={{ marginBottom: "4px" }}>
                    <span style={{ color: "#7d8590", fontSize: "9px" }}>{k}</span>
                    <span style={{ color: k === "Shipping" ? "#34d399" : "#d4d4d4", fontSize: "9px", fontWeight: k === "VAT (15%)" ? 600 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Pay button */}
              <div
                className="rounded-lg py-2 text-center"
                style={{
                  background: phase === "checkout"
                    ? "linear-gradient(90deg,#30B0B0,#509090)"
                    : "rgba(48,176,176,0.15)",
                  color: phase === "checkout" ? "#000" : "#30B0B0",
                  fontWeight: 700,
                  fontSize: "10px",
                  border: "1px solid rgba(48,176,176,0.4)",
                  transform: phase === "checkout" ? "scale(0.97)" : "scale(1)",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
              >
                {phase === "checkout" ? "Processing Payment..." : "Checkout Now"}
              </div>

              {/* Trust badges */}
              <div className="flex justify-center gap-3 mt-2">
                {["🔒 Secure", "✅ Verified", "🚚 Free Ship"].map((b) => (
                  <span key={b} style={{ color: "#3d444d", fontSize: "7px" }}>{b}</span>
                ))}
              </div>
            </>
          ) : (
            /* ── Success state ── */
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <div
                style={{
                  fontSize: "36px",
                  animation: "successBounce 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                🎉
              </div>
              <div style={{ color: "#30B0B0", fontWeight: 700, fontSize: "11px" }}>Order Confirmed!</div>
              <div style={{ color: "#7d8590", fontSize: "9px", lineHeight: 1.5 }}>
                Thanks for your purchase.<br />
                Delivery in 2–3 business days.
              </div>
              <div
                className="rounded-full px-3 py-1 mt-1"
                style={{
                  background: "rgba(52, 211, 153, 0.1)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  color: "#34d399",
                  fontSize: "9px",
                }}
              >
                Order #SD-{Math.floor(1000 + active * 137)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div
        className="flex items-center justify-between px-4 py-1.5"
        style={{
          background: "#161422",
          borderTop: "1px solid rgba(48,176,176,0.1)",
          fontSize: "9px",
          color: "#7d8590",
        }}
      >
        <span style={{ color: "#30B0B0" }}>
          {phase === "browse" && "Browsing catalogue..."}
          {phase === "hover" && `Viewing: ${prod.name}`}
          {phase === "addToCart" && "Adding to cart..."}
          {phase === "cartSlide" && "Cart updated"}
          {phase === "checkout" && "Securing payment..."}
          {phase === "success" && "Order placed!"}
        </span>
        <span>6 products</span>
        <span>🔒 SSL</span>
      </div>

      <style>{`
        @keyframes successBounce {
          0% { transform: scale(0) rotate(-20deg); }
          70% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
      `}</style>
    </div>
  );
}
