import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		fname: {
			type: String,
			required: true,
		},
		lname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

export default User;
