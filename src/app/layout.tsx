import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Shell } from "@/components/layout/shell";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Player Profile App",
  description:
    "A modern sports community MVP for discovering events, joining clubs, and building a player profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
