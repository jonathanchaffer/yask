import { eq } from "drizzle-orm";
import { posts } from "~/db/drizzle/schema";
import { dbPort } from "~/db/port";
import { createAdapter } from "~/modules/hexagonal";
import { postRepositoryPort } from "./port";

export const postRepositoryAdapter = createAdapter(
  postRepositoryPort,
  [dbPort],
  (context) => {
    const db = context.getAdapter("db").db;

    return {
      getPostsByUserId: async (userId) => {
        const postsForUser = await db.query.posts.findMany({
          where: eq(posts.userId, userId),
        });

        return postsForUser;
      },
      createPost: async (userId, title, content) => {
        await db.insert(posts).values({
          userId,
          title,
          content,
        });
      },
    };
  },
);
