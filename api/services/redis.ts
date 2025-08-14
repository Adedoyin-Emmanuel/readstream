import { redisClient } from "../utils";

export default class RedisService {
  async set<T>(key: string, value: T, ttl?: number) {
    const stringValues =
      typeof value === "string" ? value : JSON.stringify(value);

    if (ttl) {
      await redisClient.set(key, stringValues, { EX: ttl });
    } else {
      await redisClient.set(key, stringValues);
    }
  }
}
