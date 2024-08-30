import { eq } from "drizzle-orm";
import { users } from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { createAdapter } from "~/modules/hexagonal";
import { userRepositoryPort } from "./port";

export const dbUserRepositoryAdapter = createAdapter(
  userRepositoryPort,
  [dbPort],
  (context) => {
    const db = context.getAdapter("db");

    return {
      getUserById: async (id) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
        });

        if (!user) throw new Error(`User with id ${id} not found`);
        return user;
      },
      createUser: async (firstName, lastName) => {
        const createdUsers = await db
          .insert(users)
          .values({ firstName, lastName })
          .returning()
          .execute();
        return createdUsers[0];
      },
    };
  },
);
