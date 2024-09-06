import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import express from "express";
import { appContext } from "~/app/context";
import { db } from "~/db/drizzle";
import { users } from "~/db/drizzle/schema";
import { inMemoryCacheAdapter } from "~/modules/cache/adapters/in-memory";
import { redisCacheAdapter } from "~/modules/cache/adapters/redis";
import { createAdapter, createContext, createPort } from "~/modules/hexagonal";

// This file contains a simple Express server that demonstrates how to use the
// various features of the starter kit. In a real project, you'll probably
// replace this file with your own server implementation.

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.get("/redis-cache-example", async (req, res) => {
  const cacheClient = redisCacheAdapter();

  const keyToStore = "some-key";
  const valueToStore = "I'm a value coming from Redis!";

  await cacheClient.set(keyToStore, valueToStore);

  const value = await cacheClient.get(keyToStore);

  res.send(value);
});

app.get("/in-memory-cache-example", async (req, res) => {
  const cacheClient = inMemoryCacheAdapter();

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

app.get("/hexagonal-example-1", async (req, res) => {
  // A simple example of creating a "Hello, World!" application using the
  // hexagonal helpers. This example demonstrates how to create ports and
  // adapters, and how to bind them to a context. It also shows how to create
  // adapters that depend on other ports. In a real project, you'll probably
  // create a global "app context" in some other file and use it throughout
  // your application.

  const helloPort = createPort<{ sayHello: () => string }, "hello">("hello");
  const helloAdapter = createAdapter(helloPort, [], () => ({
    sayHello: () => "Hello",
  }));

  const worldPort = createPort<{ sayWorld: () => string }, "world">("world");
  const worldAdapter = createAdapter(worldPort, [], () => ({
    sayWorld: () => "World",
  }));

  const helloWorldPort = createPort<
    { sayHelloWorld: () => string },
    "helloWorld"
  >("helloWorld");
  const helloWorldAdapter = createAdapter(
    helloWorldPort,
    [helloPort, worldPort],
    (ctx) => {
      const hello = ctx.getAdapter("hello");
      const world = ctx.getAdapter("world");
      return {
        sayHelloWorld: () => `${hello.sayHello()}, ${world.sayWorld()}!`,
      };
    },
  );

  const context = createContext([
    [helloPort, helloAdapter],
    [worldPort, worldAdapter],
    [helloWorldPort, helloWorldAdapter],
  ]);

  const helloWorld = context.getAdapter("helloWorld");
  res.send(helloWorld.sayHelloWorld());
});

app.get("/hexagonal-example-2", async (req, res) => {
  // A more realistic example usage of hexagonal architecture. This example
  // imports the appContext from src/context/index.ts, which is already set up
  // with all the ports and adapters needed for the application.

  const userService = appContext.getAdapter("userService");
  const { id } = await userService.createUser(
    faker.person.firstName(),
    faker.person.lastName(),
  );
  const user = await userService.getUserById(id);
  res.send(JSON.stringify(user));
});
