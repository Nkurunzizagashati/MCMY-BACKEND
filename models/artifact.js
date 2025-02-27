import mongoose from 'mongoose';

const ArtifactSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		model3D: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Artifact = mongoose.model('Artifact', ArtifactSchema);

export default Artifact;
