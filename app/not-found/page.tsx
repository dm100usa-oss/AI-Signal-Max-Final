"use client";

import Link from "next/link";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

export default function NotFound() {
  const lang = useLang();
  const t = lang === "ru" ? ru.notFound : en.notFound;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-xl border border-amber-300 bg-white p-8 shadow-sm">
          <h1 className="mb-4 text-center text-2xl font-semibold text-neutral-900">
            {t.title}
          </h1>
          <p className="mb-6 text-center text-sm text-neutral-600">
            {t.message}
          </p>
          <Link
            href="/"
            className="inline-block w-full rounded-md bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-3 text-base font-medium text-white shadow-sm transition hover:from-amber-700 hover:to-amber-800"
          >
            {t.backButton}
          </Link>
        </div>
      </div>
    </main>
  );
}
