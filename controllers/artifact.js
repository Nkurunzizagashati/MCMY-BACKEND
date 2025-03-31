import Artifact from '../models/artifact.js';
import {
	uploadToCloudinary,
	uploadFiles,
} from '../utils/cloudinary.js';
import { getLoggedInUser } from '../utils/helpers.js';

// Controller for adding an artifact
export const addArtifact = async (req, res) => {
	try {
		const {
			title_kin,
			title_en,
			description_kin,
			description_en,
			origin_kin,
			origin_en,
			materials_kin,
			materials_en,
			usage_kin,
			usage_en,
		} = req.body;

		// Validate file existence
		if (!req.files || !req.files.image || !req.files.model3D) {
			return res
				.status(400)
				.json({ message: 'Image and 3D model are required' });
		}

		const loggedInUser = await getLoggedInUser(req);
		if (loggedInUser.email !== process.env.SUPER_USER) {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		// Upload files to Cloudinary
		const imageUrl = await uploadToCloudinary(
			req.files.image[0].buffer,
			'artifacts'
		);
		const model3DUrl = await uploadToCloudinary(
			req.files.model3D[0].buffer,
			'artifacts'
		);

		// Validate upload results
		if (!imageUrl || !model3DUrl) {
			return res
				.status(500)
				.json({ message: 'File upload failed' });
		}

		// Save artifact to database
		const newArtifact = new Artifact({
			title_kin,
			title_en,
			description_kin,
			description_en,
			origin_kin,
			origin_en,
			materials_kin,
			materials_en,
			usage_kin,
			usage_en,
			image: imageUrl,
			model3D: model3DUrl,
		});

		await newArtifact.save();

		res.status(201).json(newArtifact);
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

// Controller for retrieving artifacts
export const getArtifacts = async (req, res) => {
	try {
		const artifacts = await Artifact.find();
		res.status(200).json(artifacts);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteArtifact = async (req, res) => {
	try {
		const loggedInUser = await getLoggedInUser(req);
		const { artifactId } = req.params;
		if (loggedInUser.email !== process.env.SUPER_USER) {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		await Artifact.findByIdAndDelete(artifactId);

		const io = req.app.get('io');
		io.emit('artifactChange', { eventType: 'delete', artifactId });

		return res
			.status(200)
			.json({ message: 'Artifact deleted successfully!' });
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

export const updateArtifact = async (req, res) => {
	try {
		const { artifactId } = req.params; // Get artifact ID from request params
		console.log('REQUEST BODY: ', req.body);

		// Find the existing artifact
		const artifact = await Artifact.findById(artifactId);
		if (!artifact) {
			return res
				.status(404)
				.json({ message: 'Artifact not found' });
		}

		// Validate user authorization
		const loggedInUser = await getLoggedInUser(req);
		if (loggedInUser.email !== process.env.SUPER_USER) {
			return res.status(403).json({
				message:
					'You are not authorized to perform this action',
			});
		}

		// Prepare an object for updating only the provided fields
		const updatedFields = { ...req.body };

		// Handle optional file uploads
		if (req.files?.image) {
			updatedFields.image = await uploadToCloudinary(
				req.files.image[0].buffer,
				'artifacts'
			);
		}
		if (req.files?.model3D) {
			updatedFields.model3D = await uploadToCloudinary(
				req.files.model3D[0].buffer,
				'artifacts'
			);
		}

		// Update the artifact with only the provided fields
		const updatedArtifact = await Artifact.findByIdAndUpdate(
			artifactId,
			updatedFields,
			{
				new: true,
				runValidators: true,
			}
		);

		const io = req.app.get('io');
		io.emit('artifactChange', { eventType: 'delete', artifactId });

		return res.status(200).json({
			message: 'artifact updated successfully!',
			artifact: updateArtifact,
		});
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

// Export middleware for handling file uploads
export { uploadFiles };
