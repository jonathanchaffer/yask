import express from "express";
import { appContext } from "~/app/context";

// This file contains a simple Express server that demonstrates how to use the
// various features of the starter kit. In a real project, you'll probably
// replace this file with your own server implementation.

const app = express();
const port = 3000;

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const user = await appContext.getAdapter("userService").getUserById(userId);
  res.send(user);
});

app.post("/api/users/create", async (req, res) => {
  const user = await appContext
    .getAdapter("userService")
    .createUser(req.body.firstName, req.body.lastName);
  res.send(user);
});

app.get("/api/posts/:userId", async (req, res) => {
  const userId = req.params.userId;
  const posts = await appContext.getAdapter("postService").getPostsByUserId(userId);
  res.send(posts);
});

app.post("/api/posts/create", async (req) => {
  await appContext
    .getAdapter("postService")
    .createPost(req.body.userId, req.body.title, req.body.content);
});
