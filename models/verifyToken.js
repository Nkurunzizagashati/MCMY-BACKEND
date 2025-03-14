import mongoose from 'mongoose';

const verifyTokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 3600,
	},
});

const VerifyToken = mongoose.model('VerifyToken', verifyTokenSchema);

export default VerifyToken;
