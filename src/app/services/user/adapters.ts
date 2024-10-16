import { userRepositoryPort } from "~/app/repositories/user/port";
import { createAdapter } from "~/modules/hexagonal";
import { userServicePort } from "./port";

export const userServiceAdapter = createAdapter(
  userServicePort,
  [userRepositoryPort],
  (context) => {
    const userRepository = context.getAdapter("userRepository");

    const toUser = (userRecord: Awaited<ReturnType<typeof userRepository.getUserById>>) => ({
      id: userRecord.id,
      fullName: `${userRecord.firstName} ${userRecord.lastName}`,
    });

    return {
      getUserById: async (id) => {
        const userRecord = await userRepository.getUserById(id);
        return toUser(userRecord);
      },
      createUser: async (firstName, lastName) => {
        const userRecord = await userRepository.createUser(firstName, lastName);
        return toUser(userRecord);
      },
    };
  },
);
