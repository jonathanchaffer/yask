import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { posts } from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { createAdapter } from "~/modules/hexagonal";
import { postRepositoryPort } from "./port";

export const postRepositoryAdapter = createAdapter(postRepositoryPort, [dbPort], (context) => {
  const db = context.getAdapter("db").db;

  return {
    getPostsByUserId: async (userId) => {
      const postsForUser = await db.query.posts.findMany({
        where: eq(posts.userId, userId),
      });

      return postsForUser;
    },
    createPost: async (userId, title, content) => {
      const insertedPosts = await db
        .insert(posts)
        .values({
          userId,
          title,
          content,
        })
        .returning()
        .execute();

      return insertedPosts[0];
    },
  };
});

export const mockPostRepositoryAdapter = createAdapter(postRepositoryPort, [], () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Cannot use mock adapter outside of test environment");
  }

  return {
    getPostsByUserId: async (userId) => [
      {
        id: faker.string.uuid(),
        userId,
        title: "Post 1 title",
        content: "Post 1 content",
      },
      {
        id: faker.string.uuid(),
        userId,
        title: "Post 2 title",
        content: "Post 2 content",
      },
    ],
    createPost: async (userId, title, content) => ({
      id: faker.string.uuid(),
      userId,
      title,
      content,
    }),
  };
});
