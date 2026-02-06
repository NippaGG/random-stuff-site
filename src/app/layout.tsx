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
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}