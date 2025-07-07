import { Router } from 'express';
import userController from '../controllers/users.controller.js';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', userController.create);
router.get('/', isAuthenticated, userController.findAll);
router.get('/:id', isAuthenticated, userController.findById);
router.put('/update/:id', isAuthenticated, userController.update);
router.delete('/delete/:id', isAuthenticated, userController.remove);

export default router;