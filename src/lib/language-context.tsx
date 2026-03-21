"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Lang, Translations } from "./translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ja",
  setLang: () => {},
  t: translations.ja as unknown as Translations,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as unknown as Translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
