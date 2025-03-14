import express from 'express';
import {
	loginUser,
	registerUser,
	verifyAccount,
} from '../controllers/user.js';
import { checkSchema } from 'express-validator';
import {
	loginUserValidator,
	registerUserValidator,
} from '../middlewares/user.js';

const router = express.Router();

router.post(
	'/register',
	checkSchema(registerUserValidator),
	registerUser
);
router.post('/login', checkSchema(loginUserValidator), loginUser);
router.post('/verify', verifyAccount);

export default router;
