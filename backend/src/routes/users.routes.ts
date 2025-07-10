import { Router } from 'express';
import userController from '../controllers/users.controller';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', userController.create);
router.get('/', isAuthenticated, isAdmin, userController.findAll);
router.get('/:id', isAuthenticated, userController.findById);
router.put('/update/:id', isAuthenticated, userController.update);
router.delete('/delete/:id', isAuthenticated, isAdmin, userController.remove);

export default router;