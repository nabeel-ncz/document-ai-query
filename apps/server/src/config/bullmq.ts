import { Queue } from "bullmq";
import { redisClient } from "./redis";

export const pdfProcessingQueue = new Queue("pdf-processing", {
    connection: redisClient
})