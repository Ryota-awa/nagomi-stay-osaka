"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "@/lib/language-context";

export function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/#amenities", label: t.nav.amenities },
    { href: "/access", label: t.nav.access },
    { href: "/faq", label: t.nav.faq },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-[var(--md-outline-variant)]"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,.08)" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-medium text-base text-[var(--md-on-surface)]">
          <span className="w-8 h-8 rounded-full bg-[var(--md-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">和</span>
          <span className="hidden sm:block">The Nagomi Stay Osaka</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)] rounded-full transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--md-on-surface-variant)] hover:bg-[var(--md-surface-variant)] rounded-full transition-colors ml-1"
            aria-label="言語切替 / Switch language"
          >
            <Globe size={15} />
            <span>{lang === "ja" ? "EN" : "JA"}</span>
          </button>

          <Link
            href="/booking"
            className="ml-2 px-5 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--md-primary)" }}
          >
            {t.nav.book}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLang(lang === "ja" ? "en" : "ja")}
            className="p-2 rounded-full hover:bg-[var(--md-surface-variant)] text-[var(--md-on-surface-variant)]"
            aria-label="Switch language"
          >
            <Globe size={18} />
          </button>
          <button
            className="p-2 rounded-full hover:bg-[var(--md-surface-variant)]"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[var(--md-outline-variant)] py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-3 text-sm text-[var(--md-on-surface)] hover:bg-[var(--md-surface-variant)]"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-4 pt-2 pb-3">
            <Link
              href="/booking"
              className="block text-center px-5 py-3 rounded-full text-sm font-medium text-white"
              style={{ background: "var(--md-primary)" }}
              onClick={() => setOpen(false)}
            >
              {t.nav.book}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
