import express from 'express';
import artifactRouter from './artifact.js';
import userRouter from './user.js';
import reviewRouter from './review.js';
import subscriberRouter from './subscriber.js';

const router = express.Router();

router.use('/artifacts', artifactRouter);
router.use('/users', userRouter);
router.use('/reviews', reviewRouter);
router.use('/subscriber', subscriberRouter);

export default router;
