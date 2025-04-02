import express from 'express';
import artifactRouter from './artifact.js';
import userRouter from './user.js';
import reviewRouter from './review.js';
import subscriberRouter from './subscriber.js';
import newsLetterRouter from './newsLetter.js';

const router = express.Router();

router.use('/artifacts', artifactRouter);
router.use('/users', userRouter);
router.use('/reviews', reviewRouter);
router.use('/subscriber', subscriberRouter);
router.use('/newsletter', newsLetterRouter);

export default router;
