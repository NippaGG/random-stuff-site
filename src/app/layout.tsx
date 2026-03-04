import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // The "Hacker" font
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const mono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Random Stuff",
  description: "Curated by ShockaGG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={mono.className}>
        {/* Mobile View Block */}
        <div className="md:hidden fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white p-8 text-center h-[100dvh]">
          <h1 className="text-3xl font-bold mb-4 tracking-tight">Desktop Preferred</h1>
          <p className="text-gray-400 max-w-sm text-lg">
            Please use a desktop device or expand your browser window for the best experience. Mobile development is currently ongoing—thank you for your patience!
          </p>
        </div>

        {/* Desktop Content */}
        <div className="hidden md:contents">
          {children}
        </div>

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}