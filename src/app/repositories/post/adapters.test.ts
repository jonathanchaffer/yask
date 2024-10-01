import { withTestContext } from "~/app/context/test-context";
import { blueprints } from "~/db/blueprints";
import { mockPostRepositoryAdapter, postRepositoryAdapter } from "./adapters";
import { PostRecord } from "./port";

describe("postRepositoryAdapter", () => {
  describe("getPostsByUserId", () => {
    it(
      "gets all posts for a user, excluding posts from other users",
      withTestContext(async (context) => {
        const user = await blueprints.users(context);
        const userPost1 = await blueprints.posts(context, { userId: user.id });
        const userPost2 = await blueprints.posts(context, { userId: user.id });
        const otherUserPost = await blueprints.posts(context);

        const adapter = postRepositoryAdapter(context);

        const posts = await adapter.getPostsByUserId(user.id);
        expect(posts).toEqual(expect.arrayContaining([userPost1, userPost2]));
        expect(posts).not.toContain(otherUserPost);
      }),
    );
  });
  describe("createPost", () => {
    it(
      "creates a new post for a user",
      withTestContext(async (context) => {
        const user = await blueprints.users(context);
        const adapter = postRepositoryAdapter(context);

        await adapter.createPost(user.id, "title", "content");

        const posts = await adapter.getPostsByUserId(user.id);
        expect(posts).toHaveLength(1);
        expect(posts[0]).toMatchObject<PostRecord>({
          id: expect.any(String),
          title: "title",
          content: "content",
          userId: user.id,
        });
      }),
    );
  });
});

describe("mockPostRepositoryAdapter", () => {
  describe("getPostsByUserId", () => {
    it("returns a list of posts", async () => {
      const adapter = mockPostRepositoryAdapter();

      const posts = await adapter.getPostsByUserId("00000000-0000-0000-0000-000000000001");
      expect(posts).toHaveLength(2);
    });
  });
  describe("createPost", () => {
    it("returns a new post", async () => {
      const adapter = mockPostRepositoryAdapter();

      const post = await adapter.createPost(
        "00000000-0000-0000-0000-000000000001",
        "title",
        "content",
      );
      expect(post).toMatchObject<PostRecord>({
        id: expect.any(String),
        userId: "00000000-0000-0000-0000-000000000001",
        title: "title",
        content: "content",
      });
    });
  });
});
