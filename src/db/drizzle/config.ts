import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "src/db/drizzle/schema.ts",
  out: "src/db/drizzle/migrations",
  dbCredentials: { url: process.env.POSTGRES_DB_URL },
});
