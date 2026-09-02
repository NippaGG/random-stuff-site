import type { Metadata } from "next";
import { JetBrains_Mono, Roboto_Flex } from "next/font/google";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const mono = JetBrains_Mono({ subsets: ["latin"] });

// Variable font for the hero TextPressure effect (wght + wdth axes)
const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-hero",
});

export const metadata: Metadata = {
  title: "Random Stuff",
  description: "Directory of useful websites, software, and scripts.",
};

const shouldRenderVercelInsights =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoFlex.variable}>
      <body className={mono.className}>
        {children}

        {shouldRenderVercelInsights ? <SpeedInsights /> : null}
        {shouldRenderVercelInsights ? <Analytics /> : null}
      </body>
    </html>
  );
}
