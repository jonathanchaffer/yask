import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { userCacheStore } from "~/app/stores/user";
import { users } from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { cachePort } from "~/modules/cache/port";
import { createAdapter } from "~/modules/hexagonal";
import { userRepositoryPort } from "./port";

export const userRepositoryAdapter = createAdapter(
  userRepositoryPort,
  [dbPort, cachePort],
  (context) => {
    const db = context.getAdapter("db").db;
    const cacheStore = userCacheStore(context.getAdapter("cache"));

    return {
      getUserById: async (id) => {
        await cacheStore.connect();
        const cachedUser = await cacheStore.get({ id });

        if (cachedUser) return cachedUser;

        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
        });

        if (!user) throw new Error(`User with id ${id} not found`);

        await cacheStore.set({ id }, user);

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

export const mockUserRepositoryAdapter = createAdapter(userRepositoryPort, [], () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Cannot use mock adapter outside of test environment");
  }

  return {
    getUserById: async (id) => ({
      id,
      firstName: "John",
      lastName: "Doe",
    }),
    createUser: async (firstName, lastName) => ({
      id: faker.string.uuid(),
      firstName,
      lastName,
    }),
  };
});
