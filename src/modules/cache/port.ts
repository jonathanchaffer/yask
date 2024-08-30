import { createPort } from "~/modules/hexagonal";
import { CacheClient } from "./types";

export const cachePort = createPort<CacheClient, "cache">("cache");
