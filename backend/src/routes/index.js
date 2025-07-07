import {Router} from 'express';
import userRoutes from './users.routes.js';
import loginRoutes from './login.routes.js';
import availabilityRoutes from './availability.routes.js';
import serviceRoutes from './services.routes.js'; // etc.

const router = Router();

router.get('/', (req, res) => res.json({ message: 'API V1' })); // Rota de teste

router.use('/user', userRoutes);
router.use('/auth', loginRoutes);
router.use('/availability', availabilityRoutes);
router.use('/service', serviceRoutes);

export default router;