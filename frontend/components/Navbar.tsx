"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Result", href: "/result" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
            <div className="absolute inset-0 animate-pulse-soft rounded-lg bg-accent-green/20 blur-sm" />
            <Activity className="h-5 w-5 text-accent-green" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Derm<span className="text-accent-green">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent-green",
                pathname === link.href ? "text-accent-green" : "text-text-secondary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full p-2 transition-colors hover:bg-bg-hover text-text-secondary hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Link>
          <div className="hidden h-6 w-[1px] bg-border-subtle sm:block" />
          <div className="hidden items-center space-x-2 text-xs font-mono sm:flex">
            <div className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-text-secondary uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
