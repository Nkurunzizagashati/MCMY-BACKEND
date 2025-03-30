import express from 'express';
import { addReview, getReviews } from '../controllers/review.js';
import { checkSchema } from 'express-validator';
import { reviewValidator } from '../middlewares/review.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/:artifactId', checkSchema(reviewValidator), addReview);

export default router;
