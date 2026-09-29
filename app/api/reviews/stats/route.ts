import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";
import { SEED_REVIEWS } from "@/lib/reviewsSeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/stats
 * Возвращает: { rating: number, reviews: number }
 */
export async function GET() {
  try {
    // Получаем одобренные отзывы из Redis
    const approved = await redis.lrange("reviews:list", 0, -1);

    let totalRating = 0;
    let validCount = 0;

    // Учитываем seed-отзывы
    for (const review of SEED_REVIEWS) {
      if (typeof review.rating === "number") {
        totalRating += review.rating;
        validCount++;
      }
    }

    // Учитываем отзывы из Redis
    if (approved && approved.length > 0) {
      for (const item of approved) {
        try {
          const review = typeof item === "string" ? JSON.parse(item) : item;

          if (typeof review.rating === "number") {
            totalRating += review.rating;
            validCount++;
          }
        } catch {
          continue;
        }
      }
    }

    // Если нет ни одного валидного отзыва
    if (validCount === 0) {
      return NextResponse.json({
        rating: 4.9,
        reviews: 128,
      });
    }

    const averageRating = totalRating / validCount;

    return NextResponse.json({
      rating: parseFloat(averageRating.toFixed(1)),
      reviews: validCount,
    });
  } catch (error) {
    console.error("Error in /api/reviews/stats:", error);

    // В случае ошибки Redis - возвращаем дефолт
    return NextResponse.json({
      rating: 4.9,
      reviews: 128,
    });
  }
}
