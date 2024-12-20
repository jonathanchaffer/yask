import { User } from "~/app/services/user/port";
import { createPort } from "~/modules/hexagonal";

export type Post = {
  id: string;
  user: User;
  title: string;
  content: string;
};

export const postServicePort = createPort<
  {
    getPostsByUserId: (userId: string) => Promise<Post[]>;
    createPost: (userId: string, title: string, content: string) => Promise<Post>;
  },
  "postService"
>("postService");
