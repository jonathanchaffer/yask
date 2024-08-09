import { createInMemoryCacheClient } from "modules/cache/in-memory";
import { createRedisCacheClient } from "modules/cache/redis";

export const CACHE_CLIENT_CONSTRUCTORS = {
  redis: createRedisCacheClient,
  inMemory: createInMemoryCacheClient,
};
