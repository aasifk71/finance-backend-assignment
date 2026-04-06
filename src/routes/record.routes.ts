import { Router } from 'express';
import { RecordController } from '../controllers/record.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createRecordSchema, updateRecordSchema } from '../validations/record.validation';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['ADMIN', 'ANALYST', 'VIEWER']), RecordController.getAll);
router.get('/analytics', authorize(['ADMIN', 'ANALYST']), RecordController.getAnalytics);
router.post('/', authorize(['ADMIN', 'ANALYST']), validate(createRecordSchema), RecordController.create);
router.patch('/:id', authorize(['ADMIN', 'ANALYST']), validate(updateRecordSchema), RecordController.update);
router.delete('/:id', authorize(['ADMIN']), RecordController.delete);

export default router;