import { Queue } from "bullmq";
import { redisClient } from "./redis";

export const bullMQ = new Queue("process-pdf", {
    connection: redisClient
})
