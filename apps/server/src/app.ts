require('dotenv').config();
import express, { Request, Response, NextFunction } from "express";
import router from "@/routes";
import "@/config";

export const main = async () => {
    const app = express();

    // application middlewares
    app.use(express.json());

    // just for testing purpose
    app.all('/health', (req, res) => {
        res.send("Hey, Nabeel - Server is ⚡ON");
    });

    // project specific endpoints
    app.use('/projects', router);

    // To handle - not existing endpoints
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
        next(new Error('Page not found!'));
    });

    // To handle errors
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // implementation not completed
        res.status(400).json({ error: err?.message || "" });
    });

    app.listen(4000, () => {
        console.log(`server listenting at ${4000}`);
    });

    return app;
}