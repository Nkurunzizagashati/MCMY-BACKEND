import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import createDBConnection from './utils/db.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
	cors({
		origin: '*',
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	})
);

app.use('/api', routes);

app.get('/api', async (req, res) => {
	res.send('HELLO FROM WEBWALLET BACKEND');
});

// Connect to the Database

createDBConnection();

const PORT = process.env.PORT || 3002;

try {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
} catch (error) {
	console.error(
		`ERROR OCCURED WHILE INITIALIZING THE SERVER CONNECTION: ${error.message}`
	);
	process.exit(1);
}
