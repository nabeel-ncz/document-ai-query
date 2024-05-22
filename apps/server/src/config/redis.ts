import { Redis } from "ioredis";
export const redisClient = new Redis({
    host: process.env.REDIS_HOST as string,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS as string,
    maxRetriesPerRequest: null
});
