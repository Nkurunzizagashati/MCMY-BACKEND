import express from 'express';

const router = express.Router();

router.get('/', getArtifacts);

router.post('/', addArtifact);

export default router;
