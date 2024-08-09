import { CacheClient } from "modules/cache/types";

// Cache client that stores data in memory. Not recommended for production use.

export const createInMemoryCacheClient = (): CacheClient => {
  const cache = new Map<string, string>();

  return {
    get: async (key) => cache.get(key) ?? null,
    set: async (key, value) => {
      cache.set(key, value);
      return value;
    },
    clear: async () => cache.clear(),
  };
};
