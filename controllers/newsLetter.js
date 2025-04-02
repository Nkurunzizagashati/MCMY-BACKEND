import Newsletter from '../models/newsLetter.js';
import Subscriber from '../models/subscriber.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { sendEmail } from '../utils/helpers.js';

// Send newsletter and then create record in DB
export const sendNewsletter = async (req, res) => {
	try {
		const { description, title } = req.body;

		if (!description || !title) {
			return res.status(400).json({
				message: 'Title and description are required',
			});
		}

		if (!req.file) {
			return res
				.status(400)
				.json({ message: 'File is required' });
		}

		// Upload file to Cloudinary
		const fileUrl = await uploadToCloudinary(
			req.file.buffer,
			'newsletters'
		);
		if (!fileUrl) {
			return res
				.status(500)
				.json({ message: 'File upload failed' });
		}

		const subscribers = await Subscriber.find().populate('user');
		const recipientEmails = subscribers.map(
			(sub) => sub.user.email
		);

		if (recipientEmails.length === 0) {
			return res.status(400).json({
				message: 'No subscribers to send the newsletter to',
			});
		}

		const message = `
			<h1>${title}</h1>
			<p>${description}</p>
			<a href="${fileUrl}">Download Newsletter</a>
		`;

		await Promise.all(
			recipientEmails.map((email) =>
				sendEmail(email, message, 'New Newsletter')
			)
		);

		// Create newsletter record after sending
		const newsletter = await Newsletter.create({
			title,
			description,
			file_url: fileUrl,
			sent_count: recipientEmails.length,
		});

		const io = req.app.get('io');
		io.emit('newsletterschanged', {
			eventType: 'delete',
		});

		res.status(200).json({
			message: 'Newsletter sent and recorded successfully',
			sent_count: recipientEmails.length,
			newsletter,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getNewsletters = async (req, res) => {
	try {
		const newsletters = await Newsletter.find().sort({
			createdAt: -1,
		});
		res.status(200).json(newsletters);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
