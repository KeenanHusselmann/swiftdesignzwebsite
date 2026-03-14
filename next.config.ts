import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Prevent browsers from MIME-sniffing a response away from the declared content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Deny framing entirely — prevents clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Browsers that support this header will block reflected XSS
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Only send the origin in the Referer header (no path/query leakage)
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable unnecessary browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  images: {
    qualities: [70, 75, 85, 90],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384, 512],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
};

export default nextConfig;
