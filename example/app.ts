import express from "express";
import { createInMemoryCacheClient, createRedisCacheClient } from "starter-kit";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.get("/redis-cache-example", async (req, res) => {
  const cacheClient = await createRedisCacheClient();

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
