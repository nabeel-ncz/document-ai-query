import { Queue } from "bullmq";
import { redisClient } from "./redis";

export const bullMQ = new Queue("pdf-processing", {
    connection: redisClient
})