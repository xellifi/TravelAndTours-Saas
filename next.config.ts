import type { NextConfig } from "next";

const replitDevDomain = process.env.REPLIT_DEV_DOMAIN;

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
};

export default nextConfig;
