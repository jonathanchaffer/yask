import { CacheClient } from "modules/cache/types";
import { createClient } from "redis";

// Cache client that stores data in Redis.

export const createRedisCacheClient = (): CacheClient => {
  const client = createClient();

  return {
    connect: async () => client.connect(),
    get: async (key) => client.get(key),
    set: async (key, value) => client.set(key, value),
    clear: async () => client.flushAll(),
  };
};
