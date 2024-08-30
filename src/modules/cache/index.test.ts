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

describe.each(Object.entries(CACHE_ADAPTERS))(
  "%s cache client",
  (name, createCacheClient) => {
    describe("basic cache client", () => {
      it("throws an error if the client is not connected", async () => {
        const client = createCacheClient();

        await expect(client.get("foo")).rejects.toThrow("The client is closed");
        await expect(client.set("foo", "bar")).rejects.toThrow(
          "The client is closed",
        );
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
    });

    describe("cache store wrapper", () => {
      it("can store and retrieve values based on key and value schemas", async () => {
        const store = createCacheStore(
          {
            keySchema: z.object({ id: z.number(), secondaryId: z.string() }),
            keyFormatter: (key) => `foo-${key.id}-${key.secondaryId}`,
            valueSchema: z.object({ foo: z.string(), bar: z.number() }),
          },
          createCacheClient(),
        );
        await store.connect();

        const key = { id: 42, secondaryId: "hello" };
        const value = { foo: "world", bar: 123 };

        await store.set(key, value);

        const storedValue = await store.get(key);

        expect(storedValue).toEqual(value);
      });
      it("throws a type error when key and/or value does not conform to its schema", async () => {
        const store = createCacheStore(
          {
            keySchema: z.number(),
            keyFormatter: (key) => `${key}`,
            valueSchema: z.number(),
          },
          inMemoryCacheAdapter(),
        );

        // @ts-expect-error - value should be a number, not a string
        store.set(1, "bar");
        // @ts-expect-error - key should be a number, not a string
        store.set("foo", 1);
        // @ts-expect-error - key should be a number, not an string
        store.get({ foo: "bar" }, 1);
      });
    });
  },
);
