import { CACHE_CLIENT_CONSTRUCTORS } from "modules/cache";

// Run the same tests for each cache client implementation to ensure they all
// work the same way.

describe.each(Object.entries(CACHE_CLIENT_CONSTRUCTORS))(
  "%s cache client",
  (name, createCacheClient) => {
    it("can set and get values", async () => {
      const client = await createCacheClient();

      await client.set("foo", "bar");
      const value = await client.get("foo");

      expect(value).toEqual("bar");
    });

    it("returns null for missing keys", async () => {
      const client = await createCacheClient();
      const value = await client.get("missing");

      expect(value).toBeNull();
    });

    it("can be cleared", async () => {
      const client = await createCacheClient();

      await client.set("foo", "bar");
      await client.clear();
      const value = await client.get("foo");

      expect(value).toBeNull();
    });
  }
);
