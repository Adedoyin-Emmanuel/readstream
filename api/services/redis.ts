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

  async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    if (data === null) return null;

    const stringData = data.toString();
    try {
      return JSON.parse(stringData) as T;
    } catch {
      return stringData as T;
    }
  }

  async del(key: string): Promise<number> {
    return Number(await redisClient.del(key));
  }

  async exists(key: string): Promise<boolean> {
    return (await redisClient.exists(key)) === 1;
  }
}
