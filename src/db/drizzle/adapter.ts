import { dbPort } from "~/context/ports";
import { createAdapter } from "~/modules/hexagonal";
import { db } from ".";

export const drizzleDbAdapter = createAdapter(dbPort, () => db);
