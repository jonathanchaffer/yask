import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { dbPort } from "~/db/port";
import { createContext } from "~/modules/hexagonal";
import { dbUserRepositoryAdapter } from "~/repositories/user/adapters";
import { userRepositoryPort } from "~/repositories/user/port";
import { userServiceAdapter } from "~/services/user/adapters";
import { userServicePort } from "~/services/user/port";

// This file creates the appContext, a hexagonal context object set up with all
// the ports and adapters used by the application. The ports and adapters
// themselves are imported from their respective files. The appContext is then
// exported for use in application entry points, such as API routes.

export const appContext = createContext([
  [dbPort, drizzleDbAdapter],
  [userRepositoryPort, dbUserRepositoryAdapter],
  [userServicePort, userServiceAdapter],
]);
