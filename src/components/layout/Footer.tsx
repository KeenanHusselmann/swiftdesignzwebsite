"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

const footerLinks = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Packages", href: "/packages" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services#web" },
      { label: "E-Commerce", href: "/services#ecommerce" },
      { label: "Apps & Software", href: "/services#apps" },
      { label: "PM Training", href: "/services#training" },
      { label: "AI Training", href: "/services#ai" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[rgba(48,176,176,0.1)]">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.img
              src="/images/logo.png"
              alt="Swift Designz"
              className="h-10 w-auto mb-6"
              whileHover={{ scale: 1.05 }}
            />
            <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
              Crafting digital excellence with creative, fast, and elegant solutions.
              Helping brands stand out in the digital world.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@swiftdesignz.co.za"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--swift-teal)] transition-colors"
              >
                <Mail size={14} />
                info@swiftdesignz.co.za
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={14} />
                South Africa
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold uppercase tracking-[2px] text-[var(--swift-teal)] mb-5">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[rgba(48,176,176,0.05)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Swift Designz. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Designed & developed with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
