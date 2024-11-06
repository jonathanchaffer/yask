import { createClient } from "redis";
import { cachePort } from "~/modules/cache/port";
import { createAdapter } from "~/modules/hexagonal";

export const redisCacheAdapter = createAdapter(cachePort, [], () => {
  const client = createClient();

  return {
    connect: async () => client.connect(),
    disconnect: async () => client.disconnect(),
    get: async (key) => client.get(key),
    set: async (key, value) => client.set(key, value),
    clear: async (prefix) => {
      if (prefix === undefined) {
        return client.flushAll();
      }
      const keys = await client.keys(`${prefix}*`);
      return client.del(keys);
    },
  };
});
