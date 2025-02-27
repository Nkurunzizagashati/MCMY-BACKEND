import express from 'express';
import artifactRouter from './artifact.js';
import userRouter from './user.js';

const router = express.Router();

router.use('/artifacts', artifactRouter);
router.use('/users', userRouter);

export default router;
