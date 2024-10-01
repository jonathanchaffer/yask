import { PostRecord, postRepositoryPort } from "~/app/repositories/post/port";
import { User, userServicePort } from "~/app/services/user/port";
import { createAdapter } from "~/modules/hexagonal";
import { postServicePort } from "./port";

export const postServiceAdapter = createAdapter(
  postServicePort,
  [postRepositoryPort, userServicePort],
  (context) => {
    const postRepository = context.getAdapter("postRepository");
    const userService = context.getAdapter("userService");

    const toPost = (postRecord: PostRecord, user: User) => ({
      id: postRecord.id,
      user,
      title: postRecord.title,
      content: postRecord.content,
    });

    return {
      getPostsByUserId: async (userId) => {
        const user = await userService.getUserById(userId);
        const posts = await postRepository.getPostsByUserId(userId);
        return posts.map((p) => toPost(p, user));
      },
      createPost: async (userId, title, content) => {
        const createdPost = await postRepository.createPost(userId, title, content);
        return toPost(createdPost, await userService.getUserById(userId));
      },
    };
  },
);
