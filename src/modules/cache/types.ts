export type CacheClient = {
  get: (key: string) => Promise<string | null>;
  set: (key: string, value: string) => Promise<string | null>;
  clear: () => Promise<void>;
};
