import { createPort } from "~/modules/hexagonal";

type User = { id: string; fullName: string };
export const userServicePort = createPort<
  {
    getUserById: (id: string) => Promise<User>;
    createUser: (firstName: string, lastName: string) => Promise<User>;
  },
  "userService"
>("userService");
