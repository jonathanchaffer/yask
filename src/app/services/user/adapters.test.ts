import { faker } from "@faker-js/faker";
import { withTestContext } from "~/app/context/test-context";
import { userServiceAdapter } from "./adapters";
import { User } from "./port";

describe("userServiceAdapter", () => {
  describe("getUserById", () => {
    it(
      "returns a user, with first and last name combined into a full name",
      withTestContext(async (context) => {
        const adapter = userServiceAdapter(context);

        const userId = faker.string.uuid();
        const user = await adapter.getUserById(userId);

        expect(user).toEqual<User>({
          id: userId,
          fullName: "John Doe",
        });
      }),
    );
  });
  describe("createUser", () => {
    it(
      "returns the created user",
      withTestContext(async (context) => {
        const adapter = userServiceAdapter(context);

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const user = await adapter.createUser(firstName, lastName);

        expect(user).toEqual<User>({
          id: expect.any(String),
          fullName: `${firstName} ${lastName}`,
        });
      }),
    );
  });
});
