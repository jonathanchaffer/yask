/* eslint-disable no-restricted-imports */
import { createInMemoryCacheClient } from "./modules/cache/in-memory";
import { createRedisCacheClient } from "./modules/cache/redis";

export { createInMemoryCacheClient, createRedisCacheClient };
