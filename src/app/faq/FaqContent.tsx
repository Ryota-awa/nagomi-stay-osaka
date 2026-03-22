"use client";

import { faqs } from "./faqData";
import { useLang } from "@/lib/language-context";

export function FaqContent() {
  const { lang, t } = useLang();
  const items = faqs[lang];

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ background: "var(--md-surface)" }}>
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-light mb-2" style={{ color: "var(--md-on-surface)" }}>{t.faqPage.title}</h1>
        <p className="text-sm mb-10" style={{ color: "var(--md-on-surface-variant)" }}>{t.faqPage.subtitle}</p>

        <div className="space-y-2">
          {items.map((faq, i) => (
            <details key={i} className="group bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--md-shadow-1)" }}>
              <summary className="flex justify-between items-center px-6 py-5 cursor-pointer list-none hover:bg-[var(--md-surface-variant)] transition-colors">
                <span className="font-medium text-sm pr-4" style={{ color: "var(--md-on-surface)" }}>{faq.q}</span>
                <span className="text-xl shrink-0 group-open:rotate-45 transition-transform origin-center inline-block"
                  style={{ color: "var(--md-primary)" }}>+</span>
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed border-t pt-4"
                style={{ color: "var(--md-on-surface-variant)", borderColor: "var(--md-outline-variant)" }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

