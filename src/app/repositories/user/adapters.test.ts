import { withTestContext } from "~/app/context/test-context";
import { users } from "~/db/drizzle/schema";
import { userRepositoryAdapter } from "./adapters";

describe("userRepositoryAdapter", () => {
  describe("getUserById", () => {
    it(
      "gets a user from the database",
      withTestContext(async (context) => {
        await context
          .getAdapter("db")
          .db.insert(users)
          .values({
            id: "00000000-0000-0000-0000-000000000001",
            firstName: "John",
            lastName: "Doe",
          })
          .execute();

        const adapter = userRepositoryAdapter(context);

        const user = await adapter.getUserById(
          "00000000-0000-0000-0000-000000000001",
        );
        expect(user).toEqual({
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "John",
          lastName: "Doe",
        });
      }),
    );
    it(
      "gets a user from cache if it exists",
      withTestContext(async (context) => {
        await context.getAdapter("cache").connect();
        await context.getAdapter("userCacheStore").set(
          { id: "00000000-0000-0000-0000-000000000001" },
          {
            id: "00000000-0000-0000-0000-000000000001",
            firstName: "Foo",
            lastName: "Bar",
          },
        );

        const adapter = userRepositoryAdapter(context);

        const user = await adapter.getUserById(
          "00000000-0000-0000-0000-000000000001",
        );
        expect(user).toEqual({
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "Foo",
          lastName: "Bar",
        });
      }),
    );
    it(
      "throws an error if the user does not exist in the database or cache",
      withTestContext(async (context) => {
        const adapter = userRepositoryAdapter(context);
        await expect(
          adapter.getUserById("00000000-0000-0000-0000-000000000001"),
        ).rejects.toThrowError(
          "User with id 00000000-0000-0000-0000-000000000001 not found",
        );
      }),
    );
  });
});
