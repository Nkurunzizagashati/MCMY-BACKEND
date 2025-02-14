import express from 'express';
import artifactRouter from './artifact.js';
import userRouter from './user.js';

const router = express.Router();

router.use('/artifact', artifactRouter);
router.use('/user', userRouter);

export default router;
