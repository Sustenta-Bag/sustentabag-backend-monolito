import fs from 'fs';
import path from 'path';

export class DiskStorage {
    async save(file) {
        return `/uploads/${file.filename}`;
    }

    async delete(file) {
        if (!file || typeof file !== 'string') return;
        const fileName = path.basename(file);
        const fullPath = path.resolve(process.cwd(), 'src', 'uploads', fileName);
        
        try {
          await fs.promises.stat(fullPath);
          await fs.promises.unlink(fullPath);
        } catch (error) {
          console.error('Erro ao deletar o arquivo:', error);
        }
    }
}