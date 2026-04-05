import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "DermAI — Advanced Skin Cancer Detection",
  description: "Detect skin lesions early with our AI-powered diagnostic assistant using EfficientNet-B7.",
};

import { Providers } from "@/app/providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-bg-primary font-sans antialiased",
          dmSans.variable,
          dmMono.variable
        )}
      >
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
            <div className="relative flex min-h-screen flex-col pb-24 md:pb-0">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileNavbar />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
