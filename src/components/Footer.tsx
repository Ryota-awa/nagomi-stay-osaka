"use client";

import Link from "next/link";
import { MapPin, Train, Star } from "lucide-react";
import { PROPERTY } from "@/lib/constants";
import { useLang } from "@/lib/language-context";

export function Footer() {
  const { t } = useLang();

  return (
    <footer style={{ background: "#1C1410", color: "#E8D5CC" }}>
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-full bg-[var(--md-primary)] text-white flex items-center justify-center text-sm font-bold shrink-0">和</span>
            <span className="text-white font-medium">The Nagomi Stay Osaka</span>
          </div>
          <p className="text-sm leading-relaxed opacity-70">{t.footer.tagline}</p>
          <div className="flex items-center gap-1.5 mt-4">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm">
              {PROPERTY.rating.score}/{PROPERTY.rating.maxScore}
            </span>
            <span className="text-xs opacity-50 ml-1">— {PROPERTY.rating.label}</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wider opacity-60">{t.footer.access}</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <span>{PROPERTY.address.full}</span>
            </li>
            <li className="flex items-start gap-2">
              <Train size={14} className="mt-0.5 shrink-0 text-amber-400" />
              <span>{PROPERTY.location.nearestStation} 徒歩{PROPERTY.location.walkMinutes}分</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wider opacity-60">{t.footer.links}</h4>
          <ul className="space-y-2 text-sm opacity-80">
            {[
              { href: "/", label: t.footer.home },
              { href: "/#amenities", label: t.footer.amenities },
              { href: "/access", label: t.footer.access2 },
              { href: "/faq", label: t.footer.faq },
              { href: "/booking", label: t.footer.book },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white hover:opacity-100 transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center text-xs opacity-40 gap-2">
          <p>© {new Date().getFullYear()} The Nagomi Stay Osaka. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:opacity-80">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:opacity-80">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
