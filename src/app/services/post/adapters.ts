import { postRepositoryPort } from "~/app/repositories/post/port";
import { userServicePort } from "~/app/services/user/port";
import { createAdapter } from "~/modules/hexagonal";
import { postServicePort } from "./port";

export const postServiceAdapter = createAdapter(
  postServicePort,
  [postRepositoryPort, userServicePort],
  (context) => {
    const postRepository = context.getAdapter("postRepository");
    const userService = context.getAdapter("userService");

    return {
      getPostsByUserId: async (userId) => {
        const user = await userService.getUserById(userId);
        const posts = await postRepository.getPostsByUserId(userId);
        return posts.map((post) => ({
          id: post.id,
          user,
          title: post.title,
          content: post.content,
        }));
      },
      createPost: async (userId, title, content) => {
        await postRepository.createPost(userId, title, content);
      },
    };
  },
);
