import express, { Request, Response, NextFunction } from "express";
import { upload } from "@/utils/multer";
import { prismaClient, bullMQ } from "@/config";
import { randomImageName } from "@/utils/crypto";
import "@/queue/pdf-processing-worker";
import "@/config/redis";
import { getObjectSignedUrl, putObject } from "@/utils/bucket";

const router = express.Router();

router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title = "", description = "" } = req.body;
        const filename = randomImageName();
        const result = await prismaClient.projects.create({
            data: {
                title,
                description,
                file: filename,
                status: 'creating'
            }
        });
        await bullMQ.add('process-pdf', {
            projectId: result.id,
            fileBuffer: req.file?.buffer
        });
        await putObject(filename, req.file?.buffer, "application/pdf");
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/query/:id', async (req, res) => {
    const { id } = req.params;
    // const { query } = req.body;
    try {
        const result = await prismaClient.embeddings.findFirst({
            where: { project_id: Number(id) }
        });
        // const context = result?.vector ?? ""; 

        // const answer = await getAnswer(query, context);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'error' });
    }
});


router.get('/', async (req, res) => {
    const url = await getObjectSignedUrl("c92126c0c82bff57017c81d4982047d011f3fb5e7f01ea849c822ebcf51480f9");
    res.send(url);
})

export default router;