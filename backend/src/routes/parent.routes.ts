// src/routes/parent.routes.ts
import { Router } from 'express';
import {registerParent} from '../controllers/parent.controller.js';

const router = Router();

router.post('/register-parent', registerParent);

export default router;