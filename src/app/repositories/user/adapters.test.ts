import { withTestContext } from "~/app/context/test-context";
import { userCacheStore } from "~/app/stores/user";
import { blueprints } from "~/db/blueprints";
import { mockUserRepositoryAdapter, userRepositoryAdapter } from "./adapters";

describe("userRepositoryAdapter", () => {
  describe("getUserById", () => {
    it(
      "gets a user from the database",
      withTestContext(async (context) => {
        await blueprints.users(context, {
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "John",
          lastName: "Doe",
        });

        const adapter = userRepositoryAdapter(context);

        const user = await adapter.getUserById("00000000-0000-0000-0000-000000000001");
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
        await userCacheStore(context.getAdapter("cache")).set(
          { id: "00000000-0000-0000-0000-000000000001" },
          {
            id: "00000000-0000-0000-0000-000000000001",
            firstName: "Foo",
            lastName: "Bar",
          },
        );

        const adapter = userRepositoryAdapter(context);

        const user = await adapter.getUserById("00000000-0000-0000-0000-000000000001");
        expect(user).toEqual({
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "Foo",
          lastName: "Bar",
        });
      }),
    );
    it(
      "caches the user after fetching it from the database",
      withTestContext(async (context) => {
        await blueprints.users(context, {
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "John",
          lastName: "Doe",
        });

        const adapter = userRepositoryAdapter(context);

        await adapter.getUserById("00000000-0000-0000-0000-000000000001");

        const cachedUser = await userCacheStore(context.getAdapter("cache")).get({
          id: "00000000-0000-0000-0000-000000000001",
        });
        expect(cachedUser).toEqual({
          id: "00000000-0000-0000-0000-000000000001",
          firstName: "John",
          lastName: "Doe",
        });
      }),
    );
    it(
      "throws an error if the user does not exist in the database or cache",
      withTestContext(async (context) => {
        const adapter = userRepositoryAdapter(context);
        await expect(
          adapter.getUserById("00000000-0000-0000-0000-000000000001"),
        ).rejects.toThrowError("User with id 00000000-0000-0000-0000-000000000001 not found");
      }),
    );
  });
});

describe("mockUserRepositoryAdapter", () => {
  describe("getUserById", () => {
    it("returns a mock user", async () => {
      const adapter = mockUserRepositoryAdapter();

      const user = await adapter.getUserById("00000000-0000-0000-0000-000000000001");
      expect(user).toEqual({
        id: "00000000-0000-0000-0000-000000000001",
        firstName: "John",
        lastName: "Doe",
      });
    });
  });
  describe("createUser", () => {
    it("returns a mock user", async () => {
      const adapter = mockUserRepositoryAdapter();

      const user = await adapter.createUser("Jane", "Smith");
      expect(user).toEqual({
        id: expect.any(String),
        firstName: "Jane",
        lastName: "Smith",
      });
    });
  });
});
