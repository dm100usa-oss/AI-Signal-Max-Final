import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function saveData(key: string, value: any, ttlSeconds = 3600) {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
    console.log("Saved to Redis:", key);
  } catch (error) {
    console.error("Redis save error:", error);
  }
}

export async function getData<T = any>(key: string): Promise<T | null> {
  try {
    console.log("Fetching from Redis:", key);
    const data = await redis.get(key);
    return data ? JSON.parse(data as string) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function deleteData(key: string) {
  try {
    await redis.del(key);
    console.log("Deleted from Redis:", key);
  } catch (error) {
    console.error("Redis delete error:", error);
  }
}
