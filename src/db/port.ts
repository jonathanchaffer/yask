import { createPort } from "~/modules/hexagonal";
import { db } from "./drizzle";

// This dbPort infers its type from the db object in ./drizzle/index.ts. Most of
// the time you'll want to define port types manually so they're not coupled to
// a specific implementation. The Drizzle-provided type, however, is pretty
// full-featured and generic, so unless we need to support multiple ORMs, it's a
// worthy trade-off to use it directly here.

export const dbPort = createPort<
  { db: typeof db; truncate: () => Promise<void> },
  "db"
>("db");
