import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage (handling file uploads before sending to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Function to upload a file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.v2.uploader.upload_stream(
			{ folder, access_mode: 'public' },

			(error, result) => {
				if (error) {
					reject(
						new Error(
							'Cloudinary upload failed: ' + error.message
						)
					);
				} else {
					resolve(result.secure_url);
				}
			}
		);
		uploadStream.end(fileBuffer); // Send the file buffer to Cloudinary
	});
};

const uploadFiles = upload.fields([
	{ name: 'image', maxCount: 1 },
	{ name: 'model3D', maxCount: 1 },
]);

export { uploadToCloudinary, uploadFiles };
