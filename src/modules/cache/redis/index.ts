import { CacheClient } from "modules/cache/types";
import { createClient } from "redis";

// Cache client that stores data in Redis.

export const createRedisCacheClient = async (): Promise<CacheClient> => {
  const client = createClient();
  await client.connect();

  return {
    get: async (key) => client.get(key),
    set: async (key, value) => client.set(key, value),
    clear: async () => client.flushAll(),
  };
};
