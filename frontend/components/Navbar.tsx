"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, Clock, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useHistory, HistoryEntry } from "@/hooks/useHistory";
import HistoryDrawer from "./HistoryDrawer";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface NavLink {
  name: string;
  href: string;
  isHistory?: boolean;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Scan", href: "/scan" },
  { name: "History", href: "#", isHistory: true },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { history, removeFromHistory, clearHistory } = useHistory();

  const handleSelectHistory = (entry: HistoryEntry) => {
    sessionStorage.setItem("last_prediction", JSON.stringify(entry.prediction));
    sessionStorage.setItem("last_image", entry.image);
    setIsHistoryOpen(false);
    router.push("/result");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link 
            href={history.length > 0 ? `/result/${history[0].id}` : "/"} 
            className="flex items-center space-x-2"
          >
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
              link.isHistory ? (
                <button
                  key={link.name}
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-sm font-medium transition-colors hover:text-accent-green text-text-secondary"
                >
                  {link.name}
                </button>
              ) : (
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
              )
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="group relative rounded-full p-2 transition-colors hover:bg-bg-hover text-text-secondary hover:text-white"
            >
              <Clock className="h-5 w-5" />
              {history.length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-accent-green" />
              )}
            </button>

            <div className="h-6 w-[1px] bg-border-subtle hidden sm:block" />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 rounded-full border border-border-subtle bg-bg-secondary p-1 pr-3 transition-all hover:bg-bg-hover"
                >
                  <div className="relative h-7 w-7 overflow-hidden rounded-full ring-2 ring-accent-green/20">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-accent-purple/20 text-[10px] font-black text-accent-purple">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white hidden lg:block">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>

                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setIsProfileOpen(false)} 
                    />
                    <div className="absolute right-0 mt-4 w-56 origin-top-right rounded-3xl border border-border-visible bg-bg-card p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 z-10">
                      <div className="px-4 py-3 border-b border-border-subtle">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Signed in as</p>
                         <p className="text-xs font-bold text-white truncate">{session.user?.email}</p>
                      </div>
                      <div className="p-1 space-y-1">
                        <Link 
                          href="/profile"
                          className="flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-xs font-medium text-text-secondary hover:bg-bg-hover hover:text-white transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Clinical Profile</span>
                        </Link>
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center space-x-3 rounded-2xl px-4 py-3 text-xs font-medium text-accent-red hover:bg-accent-red/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 rounded-2xl bg-accent-green px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent-green/5"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onDelete={removeFromHistory}
        onClear={clearHistory}
      />
    </>
  );
}
