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
  const key = `review:token:${token}`;
  const exists = await redis.exists(key);
  return exists === 1;
}

/** Удалить токен (если нужно сделать одноразовым) */
export async function removeReviewToken(token: string) {
  const key = `review:token:${token}`;
  await redis.del(key);
}
