import { createPort } from "~/modules/hexagonal";
import { db } from "./drizzle";

export const dbPort = createPort<
  { db: typeof db; truncate: () => Promise<void> },
  "db"
>("db");
