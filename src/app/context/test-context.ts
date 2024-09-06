import { userRepositoryAdapter } from "~/app/repositories/user/adapters";
import { userRepositoryPort } from "~/app/repositories/user/port";
import { userServiceAdapter } from "~/app/services/user/adapters";
import { userServicePort } from "~/app/services/user/port";
import { userCacheStoreAdapter, userCacheStorePort } from "~/app/stores/user";
import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { inMemoryCacheAdapter } from "~/modules/cache/adapters/in-memory";
import { cachePort } from "~/modules/cache/port";
import { createContext } from "~/modules/hexagonal";

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

/**
 * Helper to run tests with a "test context" that follows the same structure as
 * the app context, but uses mock implementations for some of the ports.
 *
 * @example
 * describe("my test", () => {
 *   it("does something", withTestContext(async (context) => {
 *     const adapterToTest = myAdapter(context);
 *     const result = await adapterToTest.doSomething();
 *     expect(result).toEqual("expected result");
 *   })
 * );
 */
export const withTestContext =
  (fn: (context: typeof testContext) => void | Promise<void>) => async () => {
    await testContext.getAdapter("db").truncate();
    await testContext.getAdapter("cache").connect();
    await testContext.getAdapter("cache").clear();
    await testContext.getAdapter("cache").disconnect();

    await fn(testContext);
  };
