// lib/cache.ts
type CacheRecord = {
  url: string;
  mode: "quick" | "pro";
  timestamp: number;
  result: any;
};

// simple in-memory cache
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const cache = new Map<string, CacheRecord>();

export function setCache(url: string, mode: "quick" | "pro", result: any) {
  const key = `${mode}:${url}`;
  cache.set(key, { url, mode, timestamp: Date.now(), result });
}

export function getCache(url: string, mode: "quick" | "pro") {
  const key = `${mode}:${url}`;
  const record = cache.get(key);
  if (!record) return null;
  if (Date.now() - record.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return record.result;
}
