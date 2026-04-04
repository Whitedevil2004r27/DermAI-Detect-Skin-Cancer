"use client";

import Link from "next/link";
import { Activity, ShieldAlert } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-accent-green" />
              <span className="text-xl font-bold tracking-tight text-white">
                Derm<span className="text-accent-green">AI</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary max-w-xs">
              Early skin cancer detection using state-of-the-art computer vision models 
              trained on the HAM10000 clinical dataset.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Explore</h3>
              <ul className="mt-4 space-y-3">
                {["Home", "Result", "How It Works", "About"].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="text-sm text-text-secondary transition-colors hover:text-accent-green"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Legal</h3>
              <ul className="mt-4 space-y-3">
                {["Terms of Service", "Privacy Policy", "Medical Disclaimer"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-text-secondary transition-colors hover:text-accent-green"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="flex items-start space-x-3 rounded-lg border border-accent-orange/20 bg-accent-orange/5 p-4">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange" />
              <p className="text-xs leading-5 text-accent-orange/90">
                <strong className="block font-semibold">Medical Disclaimer:</strong> 
                This tool is for educational purposes only. Always consult a certified dermatologist 
                for professional medical diagnosis and treatment plans.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border-subtle pt-8 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} DermAI Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
