import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber;
