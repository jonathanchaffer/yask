import { z } from "zod";
import { createCacheStore } from ".";
import { inMemoryCacheAdapter } from "./adapters/in-memory";
import { redisCacheAdapter } from "./adapters/redis";

// Run the same tests for each cache client implementation to ensure they all
// work the same way.

const CACHE_ADAPTERS = {
  inMemory: inMemoryCacheAdapter,
  redis: redisCacheAdapter,
};

describe.each(Object.entries(CACHE_ADAPTERS))("%s cache client", (name, createCacheClient) => {
  describe("basic cache client", () => {
    it("throws an error if the client is not connected", async () => {
      const client = createCacheClient();

      await expect(client.get("foo")).rejects.toThrow("The client is closed");
      await expect(client.set("foo", "bar")).rejects.toThrow("The client is closed");
      await expect(client.clear()).rejects.toThrow("The client is closed");
    });

    it("can store and retrieve values", async () => {
      const client = createCacheClient();
      await client.connect();

      await client.set("foo", "bar");
      const value = await client.get("foo");

      expect(value).toEqual("bar");
    });

    it("returns null for missing keys", async () => {
      const client = createCacheClient();
      await client.connect();

      const value = await client.get("missing");

      expect(value).toBeNull();
    });

    it("can be cleared", async () => {
      const client = createCacheClient();
      await client.connect();

      await client.set("foo", "bar");
      await client.clear();
      const value = await client.get("foo");

      expect(value).toBeNull();
    });

    it("can clear all keys with a specified prefix", async () => {
      const client = createCacheClient();
      await client.connect();

      await client.set("foo", "bar");
      await client.set("foobar", "baz");
      await client.set("bar", "foo");
      await client.clear("foo");

      const value = await client.get("foo");
      const value2 = await client.get("foobar");
      const value3 = await client.get("bar");

      expect(value).toBeNull();
      expect(value2).toBeNull();
      expect(value3).toEqual("foo");
    });
  });

  describe("cache store wrapper", () => {
    it("can store and retrieve values based on key and value schemas", async () => {
      const store = createCacheStore({
        keySchema: z.object({ id: z.number(), secondaryId: z.string() }),
        keyFormatter: (key) => `${key.id}-${key.secondaryId}`,
        valueSchema: z.object({ foo: z.string(), bar: z.number() }),
        keyPrefix: "foo-",
      })(inMemoryCacheAdapter());

      await store.connect();

      const key = { id: 42, secondaryId: "hello" };
      const value = { foo: "world", bar: 123 };

      await store.set(key, value);

      const storedValue = await store.get(key);

      expect(storedValue).toEqual(value);
    });
    it("throws a type error when key and/or value does not conform to its schema", async () => {
      const store = createCacheStore({
        keySchema: z.number(),
        keyFormatter: (key) => `${key}`,
        valueSchema: z.number(),
        keyPrefix: "",
      })(createCacheClient());

      // @ts-expect-error - value should be a number, not a string
      store.set(1, "bar");
      // @ts-expect-error - key should be a number, not a string
      store.set("foo", 1);
      // @ts-expect-error - key should be a number, not an string
      store.get({ foo: "bar" }, 1);
    });
    it("does not affect other cache stores when clearing", async () => {
      const store1 = createCacheStore({
        keySchema: z.string(),
        keyFormatter: (key) => `${key}`,
        valueSchema: z.number(),
        keyPrefix: "store1-",
      })(createCacheClient());

      const store2 = createCacheStore({
        keySchema: z.string(),
        keyFormatter: (key) => `${key}`,
        valueSchema: z.number(),
        keyPrefix: "store2-",
      })(createCacheClient());

      await store1.connect();
      await store2.connect();

      await store1.set("a", 1);
      await store2.set("b", 2);

      await store1.clear();

      const value1 = await store1.get("a");
      const value2 = await store2.get("b");

      expect(value1).toBeNull();
      expect(value2).toEqual(2);
    });
  });
});
