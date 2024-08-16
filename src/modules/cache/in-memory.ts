import { CacheClient } from "./types";

/** Cache client that stores data in memory. Not recommended for production use. */
export const createInMemoryCacheClient = (): CacheClient => {
  const cache = new Map<string, string>();

  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "In-memory cache client is not recommended for production use."
    );
  }

  return {
    connect: async () => {},
    get: async (key) => cache.get(key) ?? null,
    set: async (key, value) => {
      cache.set(key, value);
      return value;
    },
    clear: async () => cache.clear(),
  };
};
