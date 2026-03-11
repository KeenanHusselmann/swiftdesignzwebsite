"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <section className="section pt-32">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs tracking-[4px] uppercase text-[var(--swift-teal)]">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-8">
            Cookie <span className="text-gradient">Policy</span>
          </h1>
          <div className="section-divider mb-10" />

          <div className="glass p-6 md:p-8 lg:p-12 rounded-2xl space-y-6 md:space-y-8 text-sm text-gray-400 leading-relaxed">
            <p className="text-xs text-gray-600">Last updated: March 2026</p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">1. What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website.
                They help the website remember your preferences and improve your browsing experience.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">2. Cookies We Use</h2>
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[rgba(48,176,176,0.1)]">
                      <th className="py-3 pr-4 text-xs uppercase tracking-wider text-[var(--swift-teal)]">Cookie</th>
                      <th className="py-3 pr-4 text-xs uppercase tracking-wider text-[var(--swift-teal)]">Purpose</th>
                      <th className="py-3 pr-4 text-xs uppercase tracking-wider text-[var(--swift-teal)]">Duration</th>
                      <th className="py-3 text-xs uppercase tracking-wider text-[var(--swift-teal)]">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-b border-[rgba(255,255,255,0.03)]">
                      <td className="py-3 pr-4 font-mono text-gray-300">swift-cookie-consent</td>
                      <td className="py-3 pr-4">Records your cookie consent preference</td>
                      <td className="py-3 pr-4">1 year</td>
                      <td className="py-3">Essential</td>
                    </tr>
                    <tr className="border-b border-[rgba(255,255,255,0.03)]">
                      <td className="py-3 pr-4 font-mono text-gray-300">swift-splash-seen</td>
                      <td className="py-3 pr-4">Prevents the splash screen from showing again</td>
                      <td className="py-3 pr-4">1 day</td>
                      <td className="py-3">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">3. Essential Cookies</h2>
              <p>
                These cookies are necessary for the website to function properly. They enable core
                functionality such as remembering your cookie consent choice. These cookies cannot
                be disabled.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">4. Functional Cookies</h2>
              <p>
                These cookies enhance your experience by remembering preferences and settings,
                such as whether you have seen the welcome screen. They do not track your activity
                across other websites.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">5. Managing Cookies</h2>
              <p className="mb-3">
                You can manage your cookie preferences at any time through your browser settings.
                Please note that disabling certain cookies may affect website functionality.
              </p>
              <p>
                Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies from being set</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">6. Updates</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on
                this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-3">7. Contact</h2>
              <p>
                For questions about our use of cookies, please contact us at{" "}
                <a href="mailto:info@swiftdesignz.co.za" className="text-[var(--swift-teal)] hover:underline">
                  info@swiftdesignz.co.za
                </a>{" "}
                or read our{" "}
                <Link href="/privacy" className="text-[var(--swift-teal)] hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
