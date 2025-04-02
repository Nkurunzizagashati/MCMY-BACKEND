import express from 'express';
import {
	checkSubscribtionStatus,
	getScubscribers,
	subscribe,
	unSubscribe,
} from '../controllers/subscriber.js';

const router = express.Router();

router.get('/', getScubscribers);
router.post('/', subscribe);
router.delete('/', unSubscribe);
router.get('/status', checkSubscribtionStatus);

export default router;
