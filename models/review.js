import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		artifact: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Artifact',
			required: true,
		},
		rating: {
			type: Number,
			required: true,
			min: 1.0,
			max: 5.0,
			validate: {
				validator: (value) =>
					/^([1-4](\.\d)?|5(\.0)?)$/.test(value.toString()),
				message:
					'Rating must be between 1.0 and 5.0 with up to one decimal place',
			},
		},
		message: {
			type: String,
			required: true,
			maxlength: 500,
		},
	},
	{ timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
