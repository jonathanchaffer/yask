import { drizzleDbAdapter } from "~/db/drizzle/adapter";
import { createContext } from "~/modules/hexagonal";
import { dbUserRepositoryAdapter } from "~/repositories/user";
import { userServiceAdapter } from "~/services/user";
import { dbPort, userRepositoryPort, userServicePort } from "./ports";

export const appContext = createContext();
appContext.bindAdapter(dbPort, drizzleDbAdapter);
appContext.bindAdapter(userRepositoryPort, dbUserRepositoryAdapter);
appContext.bindAdapter(userServicePort, userServiceAdapter);
