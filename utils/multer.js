import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure the "uploads" directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const multerUpload = () => {
	const storage = multer.memoryStorage(); // Use memory storage instead of disk
	const upload = multer({ storage });

	return upload;
};

export { multerUpload };
