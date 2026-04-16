"use client";

import { useState, useEffect, useCallback } from "react";
import en from "@/locales/en";
import ru from "@/locales/ru";

export type Lang = "en" | "ru";

const STORAGE_KEY = "asm_lang";

export function useTranslation() {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "ru") {
        setLangState(saved);
      }
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = lang === "ru" ? ru : en;

  return { t, lang, setLang };
}

export function useLang(): Lang {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "ru") setLang(saved);
    } catch {}
  }, []);
  return lang;
}
