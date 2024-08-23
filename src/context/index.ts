import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { createContext } from "~/modules/hexagonal";
import { dbUserRepositoryAdapter } from "~/repositories/user";
import { userServiceAdapter } from "~/services/user";
import { dbPort, userRepositoryPort, userServicePort } from "./ports";

export const appContext = createContext([
  [dbPort, drizzleDbAdapter],
  [userRepositoryPort, dbUserRepositoryAdapter],
  [userServicePort, userServiceAdapter],
]);

appContext.bindAdapter("db", drizzleDbAdapter);
appContext.bindAdapter("userRepositoryPort", dbUserRepositoryAdapter);
appContext.bindAdapter("userService", userServiceAdapter);
