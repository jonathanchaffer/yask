import { InferSelectModel } from "drizzle-orm";
import { users } from "~/db/drizzle/schema";
import { createPort } from "~/modules/hexagonal";

type UserRecord = InferSelectModel<typeof users>;

export const userRepositoryPort = createPort<
  {
    getUserById: (id: string) => Promise<UserRecord>;
    createUser: (firstName: string, lastName: string) => Promise<UserRecord>;
  },
  "userRepository"
>("userRepository");
