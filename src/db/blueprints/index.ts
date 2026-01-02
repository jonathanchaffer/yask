import { faker } from "@faker-js/faker";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
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
  data?: Partial<InferInsertModel<(typeof schema)[TTable]>>,
) => Promise<InferSelectModel<(typeof schema)[TTable]>>;

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
  ) =>
    | Promise<InferInsertModel<(typeof schema)[TTable]>>
    | InferInsertModel<(typeof schema)[TTable]>,
): Blueprint<TTable> {
  return async (context, data) => {
    const tbl = schema[table] as (typeof schema)[TTable];
    const base = await defaults(context);
    const values = { ...base, ...(data ?? {}) } as InferInsertModel<(typeof schema)[TTable]>;

    const results = await context.getAdapter("db").db.insert(tbl).values(values).returning();

    return results[0] as InferSelectModel<(typeof schema)[TTable]>;
  };
}
