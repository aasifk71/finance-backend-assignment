import { Router } from 'express';
import authRoutes from './auth.routes';
import recordRoutes from './record.routes';
import userRoutes from './user.routes'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/records', recordRoutes);
router.use('/users', userRoutes); 

export default router;