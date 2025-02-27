import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	return hashedPassword;
};

const comparePasswords = async (password, hashedPassword) => {
	const passwordsMatch = await bcrypt.compare(
		password,
		hashedPassword
	);
	return passwordsMatch;
};

const getLoggedInUser = async (req) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new Error(
				'Not authorized: Missing or malformed token'
			);
		}

		const accessToken = authHeader.split(' ')[1];

		const decodedAccessToken = jwt.verify(
			accessToken,
			process.env.JWT_SECRET
		);

		const user = await User.findOne({
			email: decodedAccessToken.email,
		});

		if (!user) {
			throw new Error('Not authorized: User not found');
		}

		return { user, userId: user._id };
	} catch (error) {
		console.error('Error in getLoggedInUser:', error.message);

		if (error.message.includes('Not authorized')) {
			throw new Error('Invalid token or not authorized');
		} else {
			throw new Error('Something went wrong');
		}
	}
};

export { hashPassword, comparePasswords, getLoggedInUser };
