import { Router } from 'express';
import userRoutes from './users.routes.js';
import authRoutes from './auth.routes.ts';
import availabilityRoutes from './availability.routes.js';
import serviceRoutes from './services.routes.js'; 
import bookingRoutes from './bookings.routes.ts';


const router = Router();

router.get('/', (req, res) => res.json({ message: 'API SISTEMA AGENDAMENTO. VERSÃO 1.0' })); 

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/availability', availabilityRoutes);
router.use('/service', serviceRoutes);
router.use('/booking', bookingRoutes);


export default router;