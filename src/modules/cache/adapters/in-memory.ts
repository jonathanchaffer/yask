import { cachePort } from "~/modules/cache/port";
import { createAdapter } from "~/modules/hexagonal";

const cache = new Map<string, string>();
let isConnected: boolean = false;

export const inMemoryCacheAdapter = createAdapter(cachePort, [], () => {
  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "In-memory cache client is not recommended for production use.",
    );
  }

  const throwIfNotConnected = () => {
    if (!isConnected) throw new Error("The client is closed");
  };

  return {
    connect: async () => {
      isConnected = true;
    },
    disconnect: async () => {
      isConnected = false;
    },
    get: async (key) => {
      throwIfNotConnected();
      return cache.get(key) ?? null;
    },
    set: async (key, value) => {
      throwIfNotConnected();
      cache.set(key, value);
      return value;
    },
    clear: async () => {
      throwIfNotConnected();
      return cache.clear();
    },
  };
});
