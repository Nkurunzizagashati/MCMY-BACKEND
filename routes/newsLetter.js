import express from 'express';

import { multerUpload } from '../utils/multer.js';
import {
	getNewsletters,
	sendNewsletter,
} from '../controllers/newsLetter.js';

const router = express.Router();
const uploadMiddleware = multerUpload().single('file');

router.post('/', uploadMiddleware, sendNewsletter);
router.get('/', getNewsletters);

export default router;
