import { createClient } from "redis";
import { CacheClient } from "./types";

/**  Cache client that stores data in Redis. */
export const createRedisCacheClient = (): CacheClient => {
  const client = createClient();

  return {
    connect: async () => client.connect(),
    get: async (key) => client.get(key),
    set: async (key, value) => client.set(key, value),
    clear: async () => client.flushAll(),
  };
};
