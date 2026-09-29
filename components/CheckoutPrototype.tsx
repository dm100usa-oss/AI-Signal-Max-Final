"use client";

import { useState } from "react";
import { BackLink } from "@/components/BackLink";

// =============================================================
//  ПРОТОТИП страницы оплаты / записи.
//  Пока БЕЗ реальной оплаты и календаря — заглушки.
//  ?service=consultation — запись на консультацию (выбор времени + оплата)
//  ?service=layout — покупка макета (оплата)
//  Реальная интеграция: Calendly (запись) + Stripe (оплата) — позже.
// =============================================================

type Texts = {
  back: string;
  payTitleConsult: string;
  payTitleLayout: string;
  pickDate: string;
  pickTime: string;
  duration: string;
  pay: string;
  stubNote: string;
  calendarStub: string;
};

const SLOTS = ["10:00", "11:30", "13:00", "15:00", "16:30"];

export function CheckoutPrototype({
  service,
  price,
  texts,
}: {
  service: string;
  price: string;
  texts: Texts;
}) {
  const isConsult = service === "consultation";
  const [time, setTime] = useState<string | null>(null);

  const handlePay = () => {
    // ЗАГЛУШКА: здесь будет переход на оплату Stripe
    alert(texts.stubNote);
  };

  return (
    <main className="mx-auto max-w-xl px-6 pt-8 pb-12 text-left">
      <div className="mt-2">
        <BackLink label={texts.back} />
      </div>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        {isConsult ? texts.payTitleConsult : texts.payTitleLayout}
      </h1>

      <div className="mt-2 text-xl font-extrabold text-[#1a4a7a]">{price}</div>

      {isConsult && (
        <>
          <p className="mt-1 text-sm text-neutral-500">{texts.duration}</p>

          {/* Заглушка календаря */}
          <div className="mt-6 rounded-[16px] border border-dashed border-neutral-300 bg-neutral-50 p-5">
            <p className="text-sm font-medium text-neutral-500">
              {texts.calendarStub}
            </p>
            <p className="mt-4 text-base font-semibold text-neutral-800">
              {texts.pickTime}
            </p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTime(s)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.97] ${
                    time === s
                      ? "bg-[#1a4a7a] text-white"
                      : "bg-white text-neutral-800 ring-1 ring-neutral-300 hover:ring-[#1a4a7a]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={isConsult && !time}
        className={`mt-7 w-full rounded-[14px] px-6 py-4 text-center text-lg font-semibold transition-all duration-200 ease-out sm:rounded-[18px] ${
          isConsult && !time
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
            : "cursor-pointer bg-[#1a4a7a] text-white shadow-[0_8px_20px_rgba(26,74,122,0.30)] hover:bg-[#163f68] active:scale-[0.98]"
        }`}
      >
        {texts.pay}
      </button>

      <p className="mt-3 text-center text-xs text-neutral-400">{texts.stubNote}</p>
    </main>
  );
}
