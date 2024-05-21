import multer from "multer";
import path from "path";

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/uploads');
    },
    filename: (req, file, callback) => {
        const uniqueId = Math.random() * 100008837839 + '';
        callback(null, `${file.fieldname}${uniqueId}${path.extname(file.originalname)}`);
    }
});

export const uploadSingleFile = multer({
    storage: fileStorage
}).single('file');