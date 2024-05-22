import { Worker } from "bullmq";
import { prismaClient, redisClient } from "@/config";
import { generateEmbeddings } from "@/utils/http";
import pdfParser from "pdf-parse";

const splitIntoSentences = (text: string) => {
    return text
        .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
        .split("|")
        .map(sentence => sentence.trim())
        .filter(sentence => sentence.length > 0);
};


export const worker = new Worker('process-pdf', async (job) => {
    const { projectId, fileBuffer } = job.data;
    try {
        const sourceData = await pdfParser(fileBuffer);
        const sourceSentences = splitIntoSentences(sourceData.text);

        const embeddings = await generateEmbeddings({
            source_sentence: sourceData.text,
            sentences: sourceSentences
        });

        console.log(embeddings);

        await prismaClient.embeddings.create({
            data: {
                project_id: Number(projectId),
                vector: embeddings
            }
        });

        await prismaClient.projects.update({
            where: { id: Number(projectId) },
            data: {
                status: 'created'
            }
        });

    } catch (error) {
        console.log('error', error);
    }
}, { connection: redisClient });

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('error', (err) => {
    console.log('job failed', err.message);
});
