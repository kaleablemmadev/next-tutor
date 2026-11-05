import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';
import { getApplication, updateProfile, } from '../controllers/tutor-application.controller.js';

const router = Router();

router.get('/application', authenticateToken, authorizeRoles('TUTOR'), getApplication);
router.put('/application/profile', authenticateToken, authorizeRoles('TUTOR'), updateProfile);

export default router;