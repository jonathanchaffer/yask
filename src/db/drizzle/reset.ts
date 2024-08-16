import { sql } from "drizzle-orm";
import { client, db } from ".";

const resetDb = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot reset the database in production.");
  }

  await db.transaction(async (tx) => {
    await tx.execute(sql`drop schema if exists public cascade`);
    await tx.execute(sql`create schema public`);
    await tx.execute(sql`drop schema if exists drizzle cascade`);
  });

  client.end();
};

void resetDb();
