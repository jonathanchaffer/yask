import { z } from "zod";

export type CacheClient<K extends z.ZodType = z.ZodString, V extends z.ZodType = z.ZodString> = {
  connect: () => Promise<unknown>;
  disconnect: () => Promise<unknown>;
  get: (key: z.infer<K>) => Promise<z.infer<V> | null>;
  set: (key: z.infer<K>, value: z.infer<V>) => Promise<z.infer<V> | null>;
  clear: () => Promise<unknown>;
};

export type CacheStoreConfig<K extends z.ZodType, V extends z.ZodType> = {
  keySchema: K;
  valueSchema: V;
  keyFormatter: (key: z.infer<K>) => string;
};
