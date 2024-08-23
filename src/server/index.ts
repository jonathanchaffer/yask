import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import express from "express";
import { db } from "~/db/drizzle";
import { users } from "~/db/drizzle/schema";
import { createInMemoryCacheClient } from "~/modules/cache/in-memory";
import { createRedisCacheClient } from "~/modules/cache/redis";
import { createAdapter, createContext, createPort } from "~/modules/hexagonal";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.get("/redis-cache-example", async (req, res) => {
  const cacheClient = createRedisCacheClient();

  const keyToStore = "some-key";
  const valueToStore = "I'm a value coming from Redis!";

  await cacheClient.set(keyToStore, valueToStore);

  const value = await cacheClient.get(keyToStore);

  res.send(value);
});

app.get("/in-memory-cache-example", async (req, res) => {
  const cacheClient = createInMemoryCacheClient();

  const keyToStore = "some-key";
  const valueToStore = "I'm a value coming from in-memory cache!";

  await cacheClient.set(keyToStore, valueToStore);

  const value = await cacheClient.get(keyToStore);

  res.send(value);
});

app.get("/drizzle-example", async (req, res) => {
  const insertedUsers = await db
    .insert(users)
    .values({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    })
    .returning();

  const userId = insertedUsers[0].id;

  const selectedUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  res.send(JSON.stringify(selectedUser));
});

app.get("/hexagonal-example", async (req, res) => {
  const helloPort = createPort<{ sayHello: () => string }>("hello");
  const helloAdapter = createAdapter(helloPort, () => ({
    sayHello: () => "Hello",
  }));

  const worldPort = createPort<{ sayWorld: () => string }>("world");
  const worldAdapter = createAdapter(worldPort, () => ({
    sayWorld: () => "World",
  }));

  const helloWorldPort = createPort<{ sayHelloWorld: () => string }>(
    "helloWorld",
  );
  const helloWorldAdapter = createAdapter(helloWorldPort, (ctx) => {
    const hello = ctx.getAdapter(helloPort);
    const world = ctx.getAdapter(worldPort);
    return {
      sayHelloWorld: () => `${hello.sayHello()}, ${world.sayWorld()}!`,
    };
  });

  const context = createContext();
  context.bindAdapter(helloPort, helloAdapter);
  context.bindAdapter(worldPort, worldAdapter);
  context.bindAdapter(helloWorldPort, helloWorldAdapter);

  const helloWorld = context.getAdapter(helloWorldPort);
  res.send(helloWorld.sayHelloWorld());
});
