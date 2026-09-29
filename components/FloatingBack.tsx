"use client";

// Плавающая кнопка «назад»: закреплена справа внизу экрана,
// всегда видна при прокрутке. Ведёт на шаг назад в браузере
// (на страницу, откуда пришёл пользователь).
export function FloatingBack({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label={label}
      className="btn-press fixed bottom-5 right-5 z-50 inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-base font-semibold text-[#0d3a6b] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] sm:bottom-6 sm:right-6"
      style={{
        backgroundColor: "rgb(222,232,245)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.5), 0 4px 10px rgba(30,40,60,0.18), 0 8px 20px rgba(30,40,60,0.15)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
      {label}
    </button>
  );
}
