import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		file_url: {
			type: String,
			required: true,
		},
		sent_count: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

export default Newsletter;
