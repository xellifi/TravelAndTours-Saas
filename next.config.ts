import type { NextConfig } from "next";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.replit.app",
    "*.riker.replit.dev",
    "*.kirk.replit.dev",
    "*.picard.replit.dev",
    "*.spock.replit.dev",
    "*.worf.replit.dev",
    "*.janeway.replit.dev",
    "*.sisko.replit.dev",
    "*.archer.replit.dev",
    ...(replitDevDomain ? [replitDevDomain] : []),
  ],
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      { protocol: "https" as const, hostname: "*.supabase.co", pathname: "/**" },
      { protocol: "https" as const, hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https" as const, hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
