import { userCacheStoreAdapter, userCacheStorePort } from "~/cache-stores/user";
import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { inMemoryCacheAdapter } from "~/modules/cache/adapters/in-memory";
import { cachePort } from "~/modules/cache/port";
import { createContext } from "~/modules/hexagonal";
import { userRepositoryAdapter } from "~/repositories/user/adapters";
import { userRepositoryPort } from "~/repositories/user/port";
import { userServiceAdapter } from "~/services/user/adapters";
import { userServicePort } from "~/services/user/port";
import { appContext } from ".";

if (process.env.NODE_ENV !== "test") {
  throw new Error("This file should only be imported in test files");
}

const testContext = createContext([
  [dbPort, drizzleDbAdapter],
  [cachePort, inMemoryCacheAdapter],
  [userCacheStorePort, userCacheStoreAdapter],
  [userRepositoryPort, userRepositoryAdapter],
  [userServicePort, userServiceAdapter],
]);

export const withTestContext =
  (fn: (context: typeof appContext) => void | Promise<void>) => async () => {
    await testContext.getAdapter("db").truncate();
    await testContext.getAdapter("cache").connect();
    await testContext.getAdapter("cache").clear();
    await testContext.getAdapter("cache").disconnect();

    await fn(testContext);
  };
