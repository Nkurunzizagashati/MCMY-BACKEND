import express from 'express';
import {
	getScubscribers,
	subscribe,
	unSubscribe,
} from '../controllers/subscriber.js';

const router = express.Router();

router.get('/', getScubscribers);
router.post('/', subscribe);
router.post('/', unSubscribe);

export default router;
