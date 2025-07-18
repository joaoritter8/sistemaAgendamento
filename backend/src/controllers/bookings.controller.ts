import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/bookings.service';
import { validateBookingData, validateUpdateBookingData } from '../utils/booking.validators'
import AppError from '../utils/AppError';


// criar o booking
async function create(req: Request, res: Response, next: NextFunction) {
  try{
    const { startDateTime, clientId, adminId, serviceIds } = req.body;       
    validateBookingData(req.body);

    const booking = await bookingService.create({startDateTime, clientId, adminId, serviceIds});
    res.status(201).json(booking);

  }catch (error) {
    next(error);
  }
}

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const bookings = await bookingService.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
}

async function findAllByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== 'string' || userId.trim() === '' || userId.length !== 24) {
      return res.status(422).json({ message: 'O ID do usuário é obrigatório' });
    }

    const bookings = await bookingService.findAllByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
}

async function findAllByUserLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;

    if(user.role == 'client') {
      const bookings = await bookingService.findAllByUserId(user.id);
      res.status(200).json(bookings);
    }
    if(user.role == 'professional') {
      const bookings = await bookingService.findAllByProfessionalId(user.id);
      res.status(200).json(bookings);
    }
    if(user.role == 'admin') {
      throw new AppError('Admins cannot access this endpoint', 403);
    }

  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string' || id.trim() === '' || id.length !== 24) {
      return res.status(422).json({ message: 'O ID da reserva é obrigatório' });
    }
    await bookingService.remove(id);
    res.status(204).json({message:'Serviço removido com sucesso!'});
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { startDateTime, clientId, adminId, serviceIds } = req.body;

    if (!id || typeof id !== 'string' || id.trim() === '' || id.length !== 24) {
      return res.status(422).json({ message: 'O ID da reserva é obrigatório' });
    }

    validateUpdateBookingData(req.body);

    const updatedBooking = await bookingService.update(id, { startDateTime, clientId, adminId, serviceIds });
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
}

export default { create, findAll, findAllByUserId, findAllByUserLoggedIn, remove, update};
