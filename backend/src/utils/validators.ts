import {parseISO, isValid} from 'date-fns';  
import { Booking } from '../types/types';
import  AppError from '../utils/AppError.ts';
import { BookingPayload } from '../types/booking.types.ts';
import { AuthPayload } from '../types/auth.types.ts';

export function isValidEmail(email: string): boolean {
  if (!email || typeof email!== 'string' || email.trim() === '') {
    throw new AppError('O email é obrigatório', 422);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidISODate(dateString: string): boolean {  
  const date = parseISO(dateString);
  return isValid(date);
}

export function isValidPassword(password: string): boolean {
    // A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}



