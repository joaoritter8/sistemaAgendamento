import { Router } from 'express';
import bookingController from '../controllers/bookings.controller';
import {isAuthenticated, isAdmin, isClient} from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', isAuthenticated, bookingController.create);
router.get('/', isAuthenticated, isAdmin, bookingController.findAll);
router.get('/:userId', isAuthenticated, isAdmin, bookingController.findAllByUserId);
router.get('/user/my-bookings', isAuthenticated, bookingController.findAllByUserLoggedIn);
router.delete('/delete/:id', isAuthenticated, isAdmin, bookingController.remove);
router.put('/update/:id', isAuthenticated, isAdmin, bookingController.update);


export default router