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

export function setCache(key: string, mode: "quick" | "pro", result: any) {
  cache.set(key, {
    url: result.url || key,
    mode,
    timestamp: Date.now(),
    result,
  });
}

export function getCache(key: string, mode: "quick" | "pro") {
  const record = cache.get(key);
  if (!record) return null;
  if (Date.now() - record.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return record.result;
}
