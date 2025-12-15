import { NextResponse } from "next/server";
import { redis } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/stats
 * Возвращает: { rating: число, reviews: число }
 */
export async function GET() {
  try {
    // Получаем одобренные отзывы из Redis
    const approved = await redis.lrange("reviews:approved", 0, -1);
    
    // Если отзывов нет - возвращаем дефолтные значения
    if (!approved || approved.length === 0) {
      return NextResponse.json({
        rating: 4.9,
        reviews: 128,
      });
    }

    // Парсим отзывы и считаем средний рейтинг
    let totalRating = 0;
    let validCount = 0;

    for (const item of approved) {
      try {
        const review = typeof item === "string" ? JSON.parse(item) : item;
        if (review.rating && typeof review.rating === "number") {
          totalRating += review.rating;
          validCount++;
        }
      } catch {
        // Пропускаем невалидные записи
        continue;
      }
    }

    // Если не удалось распарсить ни одного отзыва
    if (validCount === 0) {
      return NextResponse.json({
        rating: 4.9,
        reviews: 128,
      });
    }

    const averageRating = totalRating / validCount;

    return NextResponse.json({
      rating: parseFloat(averageRating.toFixed(1)), // округляем до 1 знака
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
