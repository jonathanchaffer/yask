import z from "zod";
import { createCacheStorePortAndAdapter } from "~/modules/cache";

export const { port: userCacheStorePort, adapter: userCacheStoreAdapter } =
  createCacheStorePortAndAdapter("userCacheStore", {
    keySchema: z.object({ id: z.string().uuid() }),
    keyFormatter: (key) => `user-${key.id}`,
    valueSchema: z.object({
      id: z.string().uuid(),
      firstName: z.string(),
      lastName: z.string(),
    }),
  });
