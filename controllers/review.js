import { matchedData, validationResult } from 'express-validator';
import Review from '../models/review.js';
import { getLoggedInUser } from '../utils/helpers.js';
import Artifact from '../models/artifact.js';
import mongoose from 'mongoose';

const getReviews = async (req, res) => {
	try {
		const { artifactId } = req.params;

		// Find reviews for the artifact
		const reviews = await Review.find({ artifactId })
			.sort({ createdAt: -1 })
			.populate('userId', 'fname lname email');

		// If no reviews are found
		if (!reviews || reviews.length === 0) {
			return res.status(404).json({
				message: 'No reviews found for this artifact',
			});
		}

		// Return the reviews
		return res.status(200).json({ reviews });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Something went wrong. Please try again later.',
		});
	}
};

const addReview = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);
		const { artifactId } = req.params;

		const isValidArtifact = await Artifact.findById(artifactId);

		if (!isValidArtifact) {
			return res
				.status(404)
				.json({ message: 'Artifact not found' });
		}

		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res
				.status(400)
				.json({ message: result.array()[0].msg });
		}

		const data = matchedData(req);
		data.user = loggedInUser._id;
		data.artifact = artifactId;

		// Create a new review
		const newReview = new Review(data);

		// Save the review to the database
		await newReview.save();

		console.log('CREATED REVIEW: ', newReview);

		const createdReview = await newReview.populate('user');

		// Send success response
		return res.status(201).json({
			message: 'Review added successfully',
			review: createdReview,
		});
	} catch (error) {
		console.error('Error in getLoggedInUser:', error.message);

		if (error.message.includes('Not authorized')) {
			return res
				.status(401)
				.json({ message: 'Invalid token or not authorized' });
		} else {
			return res
				.status(500)
				.json({ message: 'Something went wrong' });
		}
	}
};

export { getReviews, addReview };
