import QuickPreview from "@/components/QuickPreview";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-neutral-800">
      {/* Внутренний контейнер — идентичен главной странице */}
      <div className="w-full max-w-2xl px-4 sm:px-6 py-10">
        {/* Верхний блок: логотип и подзаголовок (точное совпадение с главной) */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-800">
            AI Signal Max
          </h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">
            Быстрая проверка сайта
          </p>
        </div>

        {/* Основная белая карточка с проверкой */}
        <div className="bg-white border border-neutral-200 shadow-sm rounded-2xl p-8 sm:p-10 transition-all duration-500">
          <QuickPreview />
        </div>

        {/* Дисклеймер — точно такой же, как на главной странице */}
        <footer className="mt-10 text-center text-xs text-neutral-500">
          © 2025 AI Signal Max. All rights reserved.
          <br />
          <span className="opacity-60">
            Visibility scores are estimated and based on publicly available data. Not legal advice.
          </span>
        </footer>
      </div>
    </main>
  );
}
