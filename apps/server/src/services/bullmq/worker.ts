import { Worker } from "bullmq";
import { generateEmbeddings } from "../openai";
import { db } from "../../config/prisma";
import { redisClient } from "../../config/redis";

export const pdfProcessingWorker = new Worker('pdf-processing', async (job) => {
    const { projectId, projectFile } = job.data;

    console.log(projectId, projectFile);

    try {

        // const pdfData = fs.readFileSync(`./src/uploads/${projectFile}`, 'utf-8');
        // const pdfData = `Nabeel a software engineer, he know some programming languages,
        // He is also a good ui designer, he recently started 2 start-ups, one is zakaa and other one is bytez.`
        // console.log('file read data', pdfData);
        const embeddings = await generateEmbeddings();
        console.log('embeddings - ',embeddings);

        const embCreated = await db.embeddings.create({
            data: {
                project_id: Number(projectId),
                vector: embeddings
            }
        });

        const projectUpdated = await db.projects.update({
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

pdfProcessingWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

pdfProcessingWorker.on('error', (err) => {
    console.log('job failed', err.message);
});