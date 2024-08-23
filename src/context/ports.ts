import { InferSelectModel } from "drizzle-orm";
import { db } from "~/db/drizzle";
import { users } from "~/db/drizzle/schema";
import { createPort } from "~/modules/hexagonal";

// This file contains all the ports used in the application. Ports are used to
// abstract the implementation details of the application's dependencies.

export const dbPort = createPort<typeof db>("db");

type UserRecord = InferSelectModel<typeof users>;
export const userRepositoryPort = createPort<{
  getUserById: (id: string) => Promise<UserRecord>;
  createUser: (firstName: string, lastName: string) => Promise<UserRecord>;
}>("userRepository");

type User = { id: string; fullName: string };
export const userServicePort = createPort<{
  getUserById: (id: string) => Promise<User>;
  createUser: (firstName: string, lastName: string) => Promise<User>;
}>("userService");
