"use client";

import { Suspense } from "react";
import ReviewsInner from "./ReviewsInner";

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-neutral-500">Загрузка отзывов...</div>}>
      <ReviewsInner />
    </Suspense>
  );
}
