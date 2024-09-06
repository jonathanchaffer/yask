import { InferSelectModel } from "drizzle-orm";
import { posts } from "~/db/drizzle/schema";
import { createPort } from "~/modules/hexagonal";

type PostRecord = InferSelectModel<typeof posts>;

export const postRepositoryPort = createPort<
  {
    getPostsByUserId: (userId: string) => Promise<PostRecord[]>;
  },
  "postRepository"
>("postRepository");
