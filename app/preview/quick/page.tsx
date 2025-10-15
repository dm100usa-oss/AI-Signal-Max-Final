"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function QuickPreviewInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (url) {
        router.push(`/pay?url=${encodeURIComponent(url)}`);
      } else {
        router.push("/");
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [url, router]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h1 className="text-xl md:text-2xl font-medium text-neutral-800 mb-6">
        We started checking your website
      </h1>
      <p className="text-neutral-600">
        Please wait a moment while we analyze your site before payment.
      </p>
    </main>
  );
}

export default function QuickPreview() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-neutral-500">Loading...</div>}>
      <QuickPreviewInner />
    </Suspense>
  );
}
