import { eq } from "drizzle-orm";
import { dbPort, userRepositoryPort } from "~/context/ports";
import { users } from "~/db/drizzle/schema";
import { createAdapter } from "~/modules/hexagonal";

export const dbUserRepositoryAdapter = createAdapter(
  userRepositoryPort,
  (context) => {
    const db = context.getAdapter(dbPort);

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
