// import mongoose from 'mongoose';

// const ArtifactSchema = new mongoose.Schema(
// 	{
// 		name: {
// 			type: String,
// 			required: true,
// 		},
// 		description: {
// 			type: String,
// 			required: true,
// 		},
// 		image: {
// 			type: String,
// 			required: true,
// 		},
// 		model3D: {
// 			type: String,
// 			required: true,
// 		},
// 	},
// 	{ timestamps: true }
// );

// const Artifact = mongoose.model('Artifact', ArtifactSchema);

// export default Artifact;

import mongoose from 'mongoose';

const ArtifactSchema = new mongoose.Schema(
	{
		title_kin: {
			type: String,
			required: true,
		},
		title_en: {
			type: String,
			required: true,
		},
		description_kin: {
			type: String,
			required: true,
		},
		description_en: {
			type: String,
			required: true,
		},
		origin_kin: {
			type: String,
			required: true,
		},
		origin_en: {
			type: String,
			required: true,
		},
		materials_kin: {
			type: String,
			required: true,
		},
		materials_en: {
			type: String,
			required: true,
		},
		usage_kin: {
			type: String,
			required: true,
		},
		usage_en: {
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
