import multer from 'multer';
import path from 'path';

export const multerConfig = {
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    storage: multer.diskStorage({
        destination: path.resolve(process.cwd(), 'src', 'uploads'),
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);
            cb(null, `${name}-${Date.now()}${ext}`);
        },
    })
}