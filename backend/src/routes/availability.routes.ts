import { Router } from 'express';
import availabilityController from '../controllers/availability.controller';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', isAuthenticated, isAdmin, availabilityController.create);
router.get('/', isAuthenticated, availabilityController.findAll);
router.get('/:userId', isAuthenticated, availabilityController.findAllByUserId);

export default router;