import bookingService from '../services/bookings.service.ts';
import { validateBookingData } from '../utils/validators.ts'


// criar o booking
async function create(req, res, next) {
  try{
    const { startDateTime, clientId, adminId, serviceIds } = req.body;       
    validateBookingData(req.body);

    const booking = await bookingService.create({startDateTime, clientId, adminId, serviceIds});
    res.status(201).json(booking);

  }catch (error) {
    next(error);
  }
}
export default { create};

