import { faker } from "@faker-js/faker";
import * as schema from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { HexagonalContext, HexagonalPort } from "~/modules/hexagonal/types";

// Blueprints are an easy way to seed the database with test data. They can be
// created with a set of default values (usually using Faker) and overridden
// with custom values when needed.

if (process.env.NODE_ENV !== "test") {
  throw new Error("Cannot use blueprints outside of test environment");
}

/**
 * The `blueprints` object, used for seeding the database with test data. All
 * blueprints should be defined here. The type of this object enforces that
 * every table in the schema has a corresponding blueprint.
 */
export const blueprints: {
  [TTable in keyof typeof schema]: Blueprint<TTable>;
} = {
  users: createBlueprint("users", () => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  }),
  posts: createBlueprint("posts", async (context) => {
    const user = await blueprints.users(context);
    return {
      userId: user.id,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
    };
  }),
};

type Blueprint<TTable extends keyof typeof schema> = (
  context: HexagonalContext<"db" | string, typeof dbPort | HexagonalPort>,
  data?: Partial<(typeof schema)[TTable]["$inferInsert"]>,
) => Promise<(typeof schema)[TTable]["$inferSelect"]>;

/**
 * Create a blueprint for a table in the schema.
 *
 * @example
 * createBlueprint("users", () => ({
 *   firstName: faker.person.firstName(),
 *   lastName: faker.person.lastName(),
 * }));
 */
function createBlueprint<TTable extends keyof typeof schema>(
  table: TTable,
  defaults: (
    context: HexagonalContext<"db" | string, typeof dbPort | HexagonalPort>,
  ) => Promise<(typeof schema)[TTable]["$inferInsert"]> | (typeof schema)[TTable]["$inferInsert"],
): Blueprint<TTable> {
  return async (context, data) => {
    return await context
      .getAdapter("db")
      .db.insert(schema[table])
      .values({
        ...(await defaults(context)),
        ...data,
      })
      .returning()
      .execute()
      .then((results) => results[0]);
  };
}
