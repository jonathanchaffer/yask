import { eq } from "drizzle-orm";
import { userCacheStorePort } from "~/cache-stores/user";
import { users } from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { createAdapter } from "~/modules/hexagonal";
import { userRepositoryPort } from "./port";

export const userRepositoryAdapter = createAdapter(
  userRepositoryPort,
  [dbPort, userCacheStorePort],
  (context) => {
    const db = context.getAdapter("db").db;
    const cacheStore = context.getAdapter("userCacheStore");

    return {
      getUserById: async (id) => {
        await cacheStore.connect();
        const cachedUser = await cacheStore.get({ id });

        if (cachedUser) return cachedUser;

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

        await cacheStore.set({ id: createdUsers[0].id }, createdUsers[0]);
        return createdUsers[0];
      },
    };
  },
);
