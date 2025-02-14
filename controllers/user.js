import { matchedData, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Admin from '../models/admin.js';
import { comparePasswords, hashPassword } from '../utils/helpers.js';
import { generateJWTauthToken } from '../utils/authTokens.js';

const registerUser = async (req, res) => {
	try {
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

		// GENERATE TOKENS

		const accessToken = generateJWTauthToken({
			email: newUser.email,
		});

		const userData = newUser.toObject();
		delete userData.password;

		return res.status(201).json({
			message: 'User registered successfully',
			token: accessToken,
			user: userData,
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
		const existingUser = await User.findOne({
			email: data.email,
		});
		if (!existingUser) {
			return res
				.status(401)
				.json({ message: 'Invalid credentials' });
		}

		const password = data.password;

		const passwordMatches = await comparePasswords(
			password,
			existingUser.password
		);

		console.log(passwordMatches);

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

export { registerUser, loginUser, updateUser };
