// lib/storage.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_new_KV_REST_API_URL!,
  token: process.env.KV_new_KV_REST_API_TOKEN!,
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

// ===== Лимит бесплатных проверок по IP (адресу) за месяц =====

// сколько бесплатных проверок в месяц
export const FREE_LIMIT = 1;

// ключ вида: freelimit:1.2.3.4:2026-07
function limitKey(ip: string): string {
  const now = new Date();
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  return `freelimit:${ip}:${ym}`;
}

// сколько уже использовано в этом месяце (без списания)
export async function getUsedChecks(ip: string): Promise<number> {
  try {
    const v = await redis.get<number>(limitKey(ip));
    if (typeof v === 'number') return v;
    if (v) return parseInt(String(v), 10) || 0;
    return 0;
  } catch (error) {
    console.error('Redis limit get error:', error);
    return 0;
  }
}

// списать одну проверку, вернуть новое значение счётчика
export async function incrChecks(ip: string): Promise<number> {
  try {
    const key = limitKey(ip);
    const n = await redis.incr(key);
    // при первом списании ставим срок жизни до конца месяца
    if (n === 1) {
      const now = new Date();
      const endOfMonth = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1);
      const ttl = Math.ceil((endOfMonth - now.getTime()) / 1000);
      await redis.expire(key, ttl);
    }
    return n;
  } catch (error) {
    console.error('Redis limit incr error:', error);
    return 0;
  }
}
