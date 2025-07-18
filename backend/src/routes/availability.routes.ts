import { Router } from 'express';
import availabilityController from '../controllers/availability.controller';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', isAuthenticated, isAdmin, availabilityController.create);
router.get('/', isAuthenticated, availabilityController.findAll);
router.get('/:userId', isAuthenticated, availabilityController.findAllByUserId);
router.put('/:id', isAuthenticated, isAdmin, availabilityController.update);
//router.delete('/:id', isAuthenticated, isAdmin, availabilityController.remove);

export default router;