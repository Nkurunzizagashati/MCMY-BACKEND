import { matchedData, validationResult } from 'express-validator';
import {
	comparePasswords,
	hashPassword,
	sendEmail,
} from '../utils/helpers.js';
import User from '../models/user.js';
import { generateJWTauthToken } from '../utils/authToken.js';
import VerifyToken from '../models/verifyToken.js';
import { randomBytes } from 'crypto';

const registerUser = async (req, res) => {
	try {
		console.log('REGISTERING A USER ......');
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ message: result.array()[0].msg });
		}

		const data = matchedData(req);

		if (data.password != data.confirmPassword) {
			return res.status(400).json({
				message:
					'Password and Confirm Password should be the same.',
			});
		}

		const existingUser = await User.findOne({
			email: data.email,
		});

		if (existingUser) {
			return res.status(401).json({
				message: 'Email already registered',
			});
		}

		const hashedPassword = await hashPassword(data.password);
		data.password = hashedPassword;

		// REGISTER THE USER

		const newUser = await User.create(data);

		const token = randomBytes(32).toString('hex');

		console.log('TOKEN: ', token);

		// Store token in VerifyToken collection (linked to user)
		const createdVerifyToken = await VerifyToken.create({
			userId: newUser._id,
			token,
		});

		console.log(createdVerifyToken);

		// Construct verification URL
		const verifyUrl = `${process.env.FRONTEND_HOST}/verify?token=${token}`;

		// Email message
		const message = `
			<h1>Verify your email</h1>
			<p>Click the link below to verify your account:</p>
			<a href="${verifyUrl}">${verifyUrl}</a>
		`;

		await sendEmail(newUser.email, message, 'Account Verification');

		return res.status(201).json({
			message:
				'A verification email has been sent to your email, please check.',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const loginUser = async (req, res) => {
	try {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ message: result.array()[0].msg });
		}

		const data = matchedData(req);
		const existingUser = await User.findOne({ email: data.email });

		if (!existingUser) {
			return res
				.status(401)
				.json({ message: 'Invalid credentials' });
		}

		if (!existingUser.verified) {
			return res.status(403).json({
				message:
					'Please verify your account before logging in.',
			});
		}

		const passwordMatches = await comparePasswords(
			data.password,
			existingUser.password
		);
		if (!passwordMatches) {
			return res
				.status(401)
				.json({ message: 'Invalid credentials' });
		}

		const accessToken = generateJWTauthToken({
			email: existingUser.email,
		});

		const userData = existingUser.toObject();
		delete userData.password;

		return res.status(200).json({
			message: 'Logged in successfully!',
			user: userData,
			accessToken,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const verifyAccount = async (req, res) => {
	try {
		const { token } = req.body;

		if (!token) {
			return res
				.status(400)
				.json({ message: 'Invalid verification link' });
		}

		const storedToken = await VerifyToken.findOne({ token });
		if (!storedToken) {
			return res
				.status(400)
				.json({ message: 'Invalid or expired token' });
		}

		const currentTime = Date.now();
		if (storedToken.createdAt.getTime() + 3600000 < currentTime) {
			// Token expired, delete the old token
			await VerifyToken.deleteOne({ token });

			const user = await User.findById(storedToken.userId);
			if (!user) {
				return res
					.status(404)
					.json({ message: 'User not found' });
			}

			// Check if user is already verified
			if (user.verified) {
				return res.status(400).json({
					message:
						'Account already verified. You can log in.',
				});
			}

			// Generate a new token and send a new verification email
			const newToken = randomBytes(32).toString('hex');
			const newVerifyToken = new VerifyToken({
				userId: storedToken.userId,
				token: newToken,
			});

			await newVerifyToken.save();

			const verifyUrl = `${process.env.FRONTEND_HOST}/users/${user._id}/verify?token=${newToken}`;
			const message = `
		  <h1>Verify your email</h1>
		  <p>Click the link below to verify your account:</p>
		  <a href="${verifyUrl}">${verifyUrl}</a>
		`;

			await sendEmail(
				user.email,
				message,
				'Account Verification'
			);

			return res.status(400).json({
				message:
					'Token expired. A new verification link has been sent to your email.',
			});
		}

		// If the token is still valid, check if the user is verified
		const user = await User.findById(storedToken.userId);
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.verified) {
			return res
				.status(400)
				.json({ message: 'Account already verified' });
		}

		// Mark user as verified and clean up the token
		user.verified = true;
		await user.save();

		await VerifyToken.deleteOne({ _id: storedToken._id });

		res.json({ message: 'Account successfully verified' });
	} catch (error) {
		res.status(500).json({
			message: 'Something went wrong. Try again.',
		});
	}
};

export { registerUser, loginUser, updateUser, verifyAccount };
