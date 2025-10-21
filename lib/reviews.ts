import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

/** Создать одноразовый токен доступа к отзывам (после оплаты) */
export async function createReviewToken(sessionId: string) {
  const key = `review:token:${sessionId}`;
  await redis.set(key, "valid", { ex: 60 * 60 * 24 * 7 }); // 7 дней
  return key;
}

/** Проверить, действителен ли токен */
export async function validateReviewToken(token: string) {
  // Исправлено: если токен уже содержит префикс, не добавляем его снова
  const key = token.startsWith("review:token:") ? token : `review:token:${token}`;
  const exists = await redis.exists(key);
  return exists === 1;
}

/** Удалить токен (чтобы сделать одноразовым) */
export async function removeReviewToken(token: string) {
  const key = token.startsWith("review:token:") ? token : `review:token:${token}`;
  await redis.del(key);
}
