import { userCacheStoreAdapter, userCacheStorePort } from "~/cache-stores/user";
import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { redisCacheAdapter } from "~/modules/cache/adapters/redis";
import { cachePort } from "~/modules/cache/port";
import { createContext } from "~/modules/hexagonal";
import { userRepositoryAdapter } from "~/repositories/user/adapters";
import { userRepositoryPort } from "~/repositories/user/port";
import { userServiceAdapter } from "~/services/user/adapters";
import { userServicePort } from "~/services/user/port";

// This file creates the appContext, a hexagonal context object set up with all
// the ports and adapters used by the application. The ports and adapters
// themselves are imported from their respective files. The appContext is then
// exported for use in application entry points, such as API routes.

// Depending on your application, you might also want to have separate
// serverContext and clientContext objects, along with a testContext object
// to use in your tests.

export const appContext = createContext([
  [dbPort, drizzleDbAdapter],
  [cachePort, redisCacheAdapter],
  [userCacheStorePort, userCacheStoreAdapter],
  [userRepositoryPort, userRepositoryAdapter],
  [userServicePort, userServiceAdapter],
]);
