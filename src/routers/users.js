import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { getCurrentUserController } from '../controllers/currentUser.js';

const router = express.Router();

router.use(authenticate);
router.get('/', getCurrentUserController);

export default router;
