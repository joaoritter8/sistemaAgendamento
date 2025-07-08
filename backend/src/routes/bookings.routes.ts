import { Router } from 'express';
import bookingController from '../controllers/bookings.controller.ts';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', isAuthenticated, bookingController.create);

export default router;