import express from 'express';
import {
	getUsers,
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
router.get('/', getUsers);

export default router;
