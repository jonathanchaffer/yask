import { faker } from "@faker-js/faker";
import { withTestContext } from "~/app/context/test-context";
import { postServiceAdapter } from "./adapters";
import { Post } from "./port";

describe("postServiceAdapter", () => {
  describe("getPostsByUserId", () => {
    it(
      "gets posts by user ID",
      withTestContext(async (context) => {
        const adapter = postServiceAdapter(context);

        const userId = faker.string.uuid();
        const posts = await adapter.getPostsByUserId(userId);

        expect(posts).toEqual<Post[]>([
          {
            id: expect.any(String),
            user: {
              id: userId,
              fullName: "John Doe",
            },
            title: "Post 1 title",
            content: "Post 1 content",
          },
          {
            id: expect.any(String),
            user: {
              id: userId,
              fullName: "John Doe",
            },
            title: "Post 2 title",
            content: "Post 2 content",
          },
        ]);
      }),
    );
  });
  describe("createPost", () => {
    it(
      "creates a post",
      withTestContext(async (context) => {
        const adapter = postServiceAdapter(context);

        const userId = faker.string.uuid();
        const post = await adapter.createPost(userId, "title", "content");

        expect(post).toEqual<Post>({
          id: expect.any(String),
          user: {
            id: userId,
            fullName: "John Doe",
          },
          title: "title",
          content: "content",
        });
      }),
    );
  });
});
