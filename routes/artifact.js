import express from 'express';
import { addArtifact, getArtifacts } from '../controllers/artifact.js';
import { multerUpload } from '../utils/multer.js';

const router = express.Router();

const upload = multerUpload().array('images', 10);

router.get('/', getArtifacts);

router.post(
	'/',
	multerUpload().fields([
		{ name: 'image', maxCount: 1 },
		{ name: 'model3D', maxCount: 1 },
	]),
	addArtifact
);

export default router;
