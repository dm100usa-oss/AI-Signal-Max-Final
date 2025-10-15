import { Suspense } from "react";
import QuickPreview from "@/components/QuickPreview";

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans text-neutral-800">
      <div className="w-full max-w-2xl px-4 sm:px-6 py-10">
        <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
          <QuickPreview />
        </Suspense>

        <footer className="mt-10 text-center text-xs text-neutral-500">
          © 2025 AI Signal Max. All rights reserved.
          <br />
          <span className="opacity-60">
            Visibility scores are estimated and based on publicly available data.
            Not legal advice.
          </span>
        </footer>
      </div>
    </main>
  );
}
