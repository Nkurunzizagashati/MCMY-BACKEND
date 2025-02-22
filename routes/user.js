import express from 'express';

const router = express.Router();

router.get('/', getUsers);

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
