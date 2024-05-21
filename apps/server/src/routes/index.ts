import express, { Request, Response, NextFunction } from "express";
import { uploadSingleFile } from "@/utils/multer";
import { prismaClient, bullMQ } from "@/config";

const router = express.Router();

router.post('/', uploadSingleFile, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title = "", description = "" } = req.body;
        const file = req.file?.filename as string;
        const result = await prismaClient.projects.create({
            data: {
                title,
                description,
                file,
                status: 'creating'
            }
        });
        await bullMQ.add('process-pdf', { projectId: result.id, projectFile: file });
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


export default router;