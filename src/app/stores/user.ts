import z from "zod";
import { createCacheStore } from "~/modules/cache";

export const userCacheStore = createCacheStore({
  keySchema: z.object({ id: z.string().uuid() }),
  keyFormatter: (key) => `user-${key.id}`,
  valueSchema: z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});
