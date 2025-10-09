// app/scan-failed/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function ScanFailedPage() {
  const router = useRouter();

  const back = () => router.push("/");

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-xl border border-amber-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-lg font-medium text-amber-700">
            We couldn’t complete the scan for this website. Please check the address and try again.
          </p>
          <button
            onClick={back}
            className="rounded-2xl bg-amber-600 px-5 py-2 font-medium text-white shadow-md transition-colors hover:bg-amber-700"
          >
            Back to Home
          </button>
        </div>

        <footer className="mt-8 text-center text-xs text-neutral-500">
          © 2025 AI Visibility Pro. All rights reserved.
          <br />
          <span className="opacity-60">
            Visibility scores are estimated and based on publicly available data. Not legal advice.
          </span>
        </footer>
      </div>
    </main>
  );
}
