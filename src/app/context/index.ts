import { postRepositoryAdapter } from "~/app/repositories/post/adapters";
import { postRepositoryPort } from "~/app/repositories/post/port";
import { userRepositoryAdapter } from "~/app/repositories/user/adapters";
import { userRepositoryPort } from "~/app/repositories/user/port";
import { postServiceAdapter } from "~/app/services/post/adapters";
import { postServicePort } from "~/app/services/post/port";
import { userServiceAdapter } from "~/app/services/user/adapters";
import { userServicePort } from "~/app/services/user/port";
import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { redisCacheAdapter } from "~/modules/cache/adapters/redis";
import { cachePort } from "~/modules/cache/port";
import { createContext } from "~/modules/hexagonal";

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
  [userRepositoryPort, userRepositoryAdapter],
  [userServicePort, userServiceAdapter],
  [postRepositoryPort, postRepositoryAdapter],
  [postServicePort, postServiceAdapter],
]);
