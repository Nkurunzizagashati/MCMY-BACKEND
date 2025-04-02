import Subscriber from '../models/subscriber.js';
import { getLoggedInUser } from '../utils/helpers.js';

const getScubscribers = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);

		if (loggedInUser.email !== process.env.SUPER_USER) {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		const subscribers = await Subscriber.find().populate({
			path: 'user',
			select: '-password',
		});

		return res.status(200).json({ subscribers });
	} catch (error) {
		if (error.message.includes('Not authorized')) {
			return res
				.status(500)
				.json({ message: 'Invalid token or not authorized' });
		} else {
			return res
				.status(500)
				.json({ message: 'Something went wrong' });
		}
	}
};

const subscribe = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);

		// Check if user is already subscribed
		const existingSubscriber = await Subscriber.findOne({
			user: loggedInUser._id,
		});

		if (existingSubscriber) {
			return res
				.status(400)
				.json({ message: 'You are already subscribed' });
		}

		const newSubscriber = new Subscriber({
			user: loggedInUser._id,
		});

		await newSubscriber.save();

		const io = req.app.get('io');
		io.emit('subscriptionChanges', {
			eventType: 'delete',
		});

		return res
			.status(201)
			.json({ message: 'Thank you for subscribing' });
	} catch (error) {
		if (error.message.includes('Not authorized')) {
			return res
				.status(500)
				.json({ message: 'Invalid token or not authorized' });
		} else {
			return res
				.status(500)
				.json({ message: 'Something went wrong' });
		}
	}
};

const unSubscribe = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);
		await Subscriber.findOneAndDelete({ user: loggedInUser._id });

		const io = req.app.get('io');
		io.emit('subscriptionChanges', {
			eventType: 'delete',
		});

		return res
			.status(200)
			.json({ message: 'You unscribed to our newsletter' });
	} catch (error) {
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

const checkSubscribtionStatus = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);

		const existingSubscriber = await Subscriber.findOne({
			user: loggedInUser._id,
		});

		return res.json({ isSubscribed: !!existingSubscriber });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Something went wrong' });
	}
};

export {
	getScubscribers,
	subscribe,
	unSubscribe,
	checkSubscribtionStatus,
};
