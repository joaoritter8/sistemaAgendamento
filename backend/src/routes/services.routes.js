import { Router } from 'express';
import servicesController from '../controllers/services.controller.js';
import {isAuthenticated, isAdmin} from '../middlewares/auth.middleware.js';


const router = Router();

router.get('/', isAuthenticated, servicesController.findAll);
router.get('/:name', isAuthenticated, servicesController.findByName);
router.post('/create', isAuthenticated, isAdmin, servicesController.create);
router.put('/update/:id', isAuthenticated, isAdmin, servicesController.update);
router.delete('/delete/:id', isAuthenticated, isAdmin, servicesController.remove);


export default router;