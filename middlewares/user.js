const registerUserValidator = {
	fname: {
		notEmpty: {
			errorMessage: 'First Name should not be empty',
		},
		isString: {
			errorMessage: 'First Name should be a string',
		},
	},
	lname: {
		notEmpty: {
			errorMessage: 'Last Name should not be empty',
		},
		isString: {
			errorMessage: 'Last Name should be a string',
		},
	},
	email: {
		notEmpty: {
			errorMessage: 'Email should not be empty',
		},
		isEmail: {
			errorMessage: 'Email should be a valid email',
		},
	},
	password: {
		notEmpty: {
			errorMessage: 'Password should not be empty',
		},
		isString: {
			errorMessage: 'Password should be a string',
		},
		isLength: {
			options: {
				min: 6,
				max: 10,
			},
			errorMessage: 'Password should have 6 to 10 characters',
		},
	},
	confirmPassword: {
		notEmpty: {
			errorMessage: 'Password should not be empty',
		},
		isString: {
			errorMessage: 'Password should be a string',
		},
		isLength: {
			options: {
				min: 6,
				max: 10,
			},
			errorMessage: 'Password should have 6 to 10 characters',
		},
	},
};

const loginUserValidator = {
	email: {
		notEmpty: {
			errorMessage: 'Email should not be empty',
		},
		isEmail: {
			errorMessage: 'Email should be a valid email',
		},
	},
	password: {
		notEmpty: {
			errorMessage: 'Password should not be empty',
		},
		isString: {
			errorMessage: 'Password should be a string',
		},
		isLength: {
			options: {
				min: 6,
				max: 10,
			},
			errorMessage: 'Password should have 6 to 10 characters',
		},
	},
};

const deleteUserValidator = {
	userId: {
		in: ['params'],
		notEmpty: {
			errorMessage:
				'You need to provide an ID for the user you want to delete',
		},
		isString: {
			errorMessage: 'ID should be a string',
		},
	},
};

const updateUserValidator = {
	name: {
		optional: { options: { nullable: true } },
		notEmpty: {
			errorMessage: 'Name should not be empty',
		},
		isString: {
			errorMessage: 'Name should be a string',
		},
	},
	email: {
		optional: { options: { nullable: true } },
		notEmpty: {
			errorMessage: 'Email should not be empty',
		},
		isEmail: {
			errorMessage: 'Email should be a valid email',
		},
	},
	password: {
		optional: { options: { nullable: true } },
		notEmpty: {
			errorMessage: 'Password should not be empty',
		},
		isString: {
			errorMessage: 'Password should be a string',
		},
		isLength: {
			options: {
				min: 6,
				max: 10,
			},
			errorMessage: 'Password should have 6 to 10 characters',
		},
	},
};

export {
	registerUserValidator,
	loginUserValidator,
	deleteUserValidator,
	updateUserValidator,
};
