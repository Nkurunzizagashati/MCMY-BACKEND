import Artifact from '../models/artifact.js';
import {
	uploadToCloudinary,
	uploadFiles,
} from '../utils/cloudinary.js';

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
		console.error('Error:', error);
		res.status(500).json({ message: error.message });
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

// Export middleware for handling file uploads
export { uploadFiles };
