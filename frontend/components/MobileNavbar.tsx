"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Result", href: "/result", icon: LayoutDashboard },
  { name: "About", href: "/about", icon: Info },
];

export default function MobileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden">
      <div className="bg-bg-card/80 backdrop-blur-xl border-t border-border-visible/50 px-6 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
        <ul className="flex items-center justify-around">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center space-y-1 transition-all duration-300",
                    isActive 
                      ? "text-accent-green" 
                      : "text-text-muted hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-xl transition-all duration-300",
                    isActive ? "bg-accent-green/10 scale-110" : "bg-transparent"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    isActive ? "opacity-100" : "opacity-0"
                  )}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Safe Area Inset for modern mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)] bg-bg-card/80 backdrop-blur-xl" />
    </nav>
  );
}
