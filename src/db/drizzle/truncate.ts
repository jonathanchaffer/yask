import { sql } from "drizzle-orm";
import { db } from ".";

export const truncateDb = async () => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Cannot truncate the database in production.");
  }

  await db.execute(sql`
    DO $$ 
    DECLARE
      tbl_name text;
    BEGIN
      FOR tbl_name IN
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(tbl_name) || ' CASCADE;';
      END LOOP;
    END $$;
  `);
};
