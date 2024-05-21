require('dotenv').config();
import express from "express";
import multer from "multer";
import { db } from "./config/prisma";
import { pdfProcessingQueue } from "./config/bullmq";
import path from "path";

import "./config/redis";
import "./services/bullmq/worker";

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/uploads');
    },
    filename: (req, file, callback) => {
        const uniqueId = Math.random() * 100008837839 + '';
        callback(null, `${file.fieldname}${uniqueId}${path.extname(file.originalname)}`);
    }
});

const uploadSingleFile = multer({
    storage: fileStorage
}).single('file');

app.use(express.json());

app.all('/health', (req, res) => {
    res.send("⚡⚡⚡⚡");
});

app.post('/projects', uploadSingleFile, async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;
    console.log(req.file)
    const result = await db.projects.create({
        data: {
            title,
            description,
            file: file?.path as string,
            status: 'creating'
        }
    });
    console.log(result)
    await pdfProcessingQueue.add('process-pdf', { projectId: result.id, projectFile: file?.filename });
    res.status(201).json(result);
});


// app.post('/projects/:id', async (req, res) => {
//     const { id } = req.params;
//     const { query } = req.body;

//     try {
//         const result = await db.embeddings.findFirst({
//             where: { project_id: Number(id) }
//         });
//         console.log('result : ', result);
//         const context = result?.vector ?? ""; // Combine vectors into a single context string

//         const answer = await getAnswer(query, context);
//         res.json({ answer });
//     } catch (error) {
//         res.status(500).json({ error: 'error' });
//     }
// });


app.listen(4000, () => {
    console.log(`server listenting at ${4000}`);
});