import { InferSelectModel } from "drizzle-orm";
import { posts } from "~/db/drizzle/schema";
import { createPort } from "~/modules/hexagonal";

export type PostRecord = InferSelectModel<typeof posts>;

export const postRepositoryPort = createPort<
  {
    getPostsByUserId: (userId: string) => Promise<PostRecord[]>;
    createPost: (
      userId: string,
      title: string,
      content: string,
    ) => Promise<void>;
  },
  "postRepository"
>("postRepository");
