"use client";

import { useRouter } from "next/navigation";
import { useLang } from "@/hooks/useTranslation";
import en from "@/locales/en";
import ru from "@/locales/ru";

export default function ScanFailedPage() {
  const router = useRouter();
  const lang = useLang();
  const t = lang === "ru" ? ru.scanFailed : en.scanFailed;
  const tf = lang === "ru" ? ru.footer : en.footer;

  const back = () => router.push("/");

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-lg font-medium text-amber-700">
            {t.message}
          </p>
          <button
            onClick={back}
            className="rounded-2xl bg-amber-600 px-5 py-2 font-medium text-white shadow-md transition-colors hover:bg-amber-700"
          >
            {t.backButton}
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-neutral-500">
          {tf.copyright}
          <br />
          <span className="opacity-60">{tf.disclaimer}</span>
        </footer>
      </div>
    </main>
  );
}
