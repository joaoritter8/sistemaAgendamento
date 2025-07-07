import { Router } from 'express';
import loginController from '../controllers/login.controller.js';

const router = Router();

router.post('/login', loginController.login);
//router.get('/', userController.findAll);
// router.get('/:id', userController.findById);

export default router;