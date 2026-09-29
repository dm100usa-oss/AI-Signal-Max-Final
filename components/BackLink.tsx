"use client";

// Аккуратная тёмно-синяя стрелка «назад». Неяркая, не мешающая.
// Если передан href — ссылка; иначе history.back().
export function BackLink({ href, label }: { href?: string; label: string }) {
  const cls =
    "inline-flex items-center gap-1.5 rounded-[12px] px-4 py-2 text-base font-semibold text-[#0d3a6b] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";
  const style = {
    backgroundColor: "rgb(222,232,245)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(30,40,60,0.10), 0 4px 12px rgba(30,40,60,0.10)",
  };
  const inner = (
    <>
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
    </>
  );

  if (href) {
    return (
      <a href={href} className={cls} style={style}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => window.history.back()} className={cls} style={style}>
      {inner}
    </button>
  );
}
