// lib/cache.ts
import fs from "node:fs";
import path from "node:path";

type CacheRecord = {
  url: string;
  mode: "quick" | "pro";
  timestamp: number;
  result: any;
};

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const TMP_FILE = path.join("/tmp", "cache.json");

// Load cache from file if it exists
function loadCache(): Map<string, CacheRecord> {
  try {
    if (fs.existsSync(TMP_FILE)) {
      const data = fs.readFileSync(TMP_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return new Map(Object.entries(parsed));
    }
  } catch (err) {
    console.error("Failed to load cache:", err);
  }
  return new Map();
}

// Save cache to file
function saveCache(cache: Map<string, CacheRecord>) {
  try {
    const obj = Object.fromEntries(cache.entries());
    fs.writeFileSync(TMP_FILE, JSON.stringify(obj));
  } catch (err) {
    console.error("Failed to save cache:", err);
  }
}

// Initialize cache
const cache = loadCache();

export function setCache(key: string, mode: "quick" | "pro", result: any) {
  cache.set(key, {
    url: result.url || key,
    mode,
    timestamp: Date.now(),
    result,
  });
  saveCache(cache);
}

export function getCache(key: string, mode: "quick" | "pro") {
  const record = cache.get(key);
  if (!record) return null;
  if (Date.now() - record.timestamp > CACHE_TTL) {
    cache.delete(key);
    saveCache(cache);
    return null;
  }
  return record.result;
}
