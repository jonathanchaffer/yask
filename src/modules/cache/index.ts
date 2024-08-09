import { createInMemoryCacheClient } from "modules/cache/in-memory";
import { createRedisCacheClient } from "modules/cache/redis";
import { CacheClient, CacheStoreConfig } from "modules/cache/types";
import { z } from "zod";

export const CACHE_CLIENT_CONSTRUCTORS = {
  redis: createRedisCacheClient,
  inMemory: createInMemoryCacheClient,
};

export function createCacheStore<K extends z.ZodType, V extends z.ZodType>(
  config: CacheStoreConfig<K, V>,
  cacheClient: CacheClient
): CacheClient<K, V> {
  return {
    connect: () => cacheClient.connect(),
    get: async (key) => {
      const formattedKey = config.keyFormatter(key);
      const value = await cacheClient.get(formattedKey);
      if (value === null) {
        return null;
      }
      return config.valueSchema.parse(JSON.parse(value));
    },
    set: async (key, value) => {
      const formattedKey = config.keyFormatter(key);
      const storedValue = await cacheClient.set(
        formattedKey,
        JSON.stringify(value)
      );
      return storedValue ? value : null;
    },
    clear: cacheClient.clear,
  };
}
