import { dbPort } from "~/db/port";
import { createAdapter } from "~/modules/hexagonal";
import { db } from ".";
import { truncateDb } from "./truncate";

export const drizzleDbAdapter = createAdapter(dbPort, [], () => ({
  db,
  truncate: truncateDb,
}));
