const reviewValidator = {
	rating: {
		notEmpty: {
			errorMessage: 'Rating should not be empty',
		},
		isFloat: {
			options: { min: 1.0, max: 5.0 },
			errorMessage: 'Rating must be between 1.0 and 5.0',
		},
		matches: {
			options: [/^([1-4](\.\d)?|5(\.0)?)$/],
			errorMessage: 'Rating must have at most one decimal place',
		},
	},
	message: {
		notEmpty: {
			errorMessage: 'Review message should not be empty',
		},
		isString: {
			errorMessage: 'Review message should be a string',
		},
		isLength: {
			options: { min: 5, max: 500 },
			errorMessage:
				'Review message must be between 5 and 500 characters',
		},
	},
};

export { reviewValidator };
