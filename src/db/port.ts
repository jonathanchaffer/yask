import { createPort } from "~/modules/hexagonal";
import { db } from "./drizzle";

export const dbPort = createPort<typeof db, "db">("db");
