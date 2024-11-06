import { z } from "zod";
import { CacheClient, CacheStoreConfig } from "./types";

/**
 * Create a cache "store" that wraps a cache client and enforces a specific key
 * and value schema, providing type safety on storage and retrieval.
 */
export function createCacheStore<K extends z.ZodType, V extends z.ZodType>(
  config: CacheStoreConfig<K, V>,
) {
  return (cacheClient: CacheClient): CacheClient<K, V> => {
    const keyFormatterWithPrefix = (key: z.infer<K>) => {
      const formattedKey = config.keyFormatter(key);
      return `${config.keyPrefix}${formattedKey}`;
    };
    return {
      connect: () => cacheClient.connect(),
      disconnect: () => cacheClient.disconnect(),
      get: async (key) => {
        const formattedKey = keyFormatterWithPrefix(key);
        const value = await cacheClient.get(formattedKey);
        if (value === null) {
          return null;
        }
        return config.valueSchema.parse(JSON.parse(value));
      },
      set: async (key, value) => {
        const formattedKey = keyFormatterWithPrefix(key);
        const storedValue = await cacheClient.set(formattedKey, JSON.stringify(value));
        return storedValue ? value : null;
      },
      clear: async () => {
        await cacheClient.clear(config.keyPrefix);
      },
    };
  };
}
