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
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.12), 0 6px 16px rgba(30,40,60,0.16)" }}
            className="rounded-2xl bg-amber-600 px-5 py-2 font-medium text-white transition-all duration-200 ease-out hover:bg-amber-700 hover:scale-[1.02] active:scale-[0.98] md:ring-1 md:ring-black/5"
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
