import {parseISO, isValid} from 'date-fns';  
import { Booking } from '../types/types';
import  AppError from '../utils/AppError.ts';
import { BookingPayload } from '../types/booking.types.ts';

export function isValidEmail(email: string): boolean {
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

export function validateBookingData(data: BookingPayload): void {
  const {  startDateTime, clientId, adminId, serviceIds } = data;  
  
  if (!startDateTime ) {
    throw new AppError('O horário de início é obrigatório', 422 );
  }
  if (!isValidISODate(startDateTime)) {
    throw new AppError('O formato do horário de início é inválido. Use o formato ISO 8601.', 422 );
  }  
  if (!clientId || typeof clientId!=='string' || clientId.trim() === '') {
    throw new AppError('O cliente é obrigatório', 422 );
  }
  if (!adminId || typeof adminId!=='string' || adminId.trim() === '') {
    throw new AppError('O profissional é obrigatório', 422 );
  }
  if (!serviceIds ||!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw new AppError('Pelo menos um serviço deve ser selecionado.', 422 );
  }
  if (!serviceIds.every(id => typeof id === 'string' && id.trim() !== '')) {
    throw new AppError('Cada ID de serviço na lista deve ser uma string válida.', 422);
  }  
  return;

}