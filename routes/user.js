import express from 'express';
import { loginUser, registerUser } from '../controllers/user.js';
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

export default router;
