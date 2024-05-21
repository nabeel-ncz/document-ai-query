import { Worker } from "bullmq";
import { prismaClient, redisClient } from "@/config";
import { generateEmbeddings } from "@/utils/http";

export const worker = new Worker('pdf-processing', async (job) => {
    const { projectId, projectFile } = job.data;
    console.log(projectId, projectFile);
    try {
        const embeddings = await generateEmbeddings();
        const embCreated = await prismaClient.embeddings.create({
            data: {
                project_id: Number(projectId),
                vector: embeddings
            }
        });
        const projectUpdated = await prismaClient.projects.update({
            where: { id: Number(projectId) },
            data: {
                status: 'created'
            }
        });
        console.log('embedded created : ', embCreated);
        console.log('project updated : ', projectUpdated);
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