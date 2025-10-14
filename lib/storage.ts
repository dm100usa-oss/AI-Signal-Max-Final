// lib/storage.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function saveData(key: string, value: any, ttlSeconds = 3600) {
  try {
    const serialized = JSON.stringify(value);
    await redis.set(key, serialized, { ex: ttlSeconds });
    console.log('Saved to Redis:', key);
  } catch (error) {
    console.error('Redis save error:', error);
  }
}

export async function getData<T = any>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<string>(key);
    if (!data) return null;

    if (typeof data === 'string') {
      return JSON.parse(data);
    }

    // fallback for unexpected object values
    if (typeof data === 'object') {
      return data as T;
    }

    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function deleteData(key: string) {
  try {
    await redis.del(key);
    console.log('Deleted from Redis:', key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}
