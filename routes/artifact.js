import express from 'express';
import {
	addArtifact,
	deleteArtifact,
	getArtifacts,
	updateArtifact,
} from '../controllers/artifact.js';
import { multerUpload } from '../utils/multer.js';

const router = express.Router();

// Define upload middleware once for reusability
const uploadMiddleware = multerUpload().fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'model3D', maxCount: 1 },
]);

// Routes
router.get('/', getArtifacts);

router.post('/', uploadMiddleware, addArtifact);
router.patch('/:artifactId', uploadMiddleware, updateArtifact);
router.delete('/:artifactId', deleteArtifact);

export default router;
