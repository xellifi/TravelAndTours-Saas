import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "mywebpages — Build Your Business Website in Minutes",
  description:
    "mywebpages is a multi-tenant SaaS platform for travel agencies, restaurants, gyms, and more. Create beautiful landing pages, manage bookings, and grow your business today.",
};

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="apple-touch-icon" href="/icons/icon-travel.svg" />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
