import { BookingPayload } from "../types/booking.types";
import AppError from "./AppError";
import { isValidISODate } from "./validators";

export function validateBookingData(data: BookingPayload): void {
  const {  startDateTime, clientId, adminId, serviceIds } = data;  
  
  if (!startDateTime ) {
    throw new AppError('O horário de início é obrigatório', 422 );
  }
  if (!isValidISODate(startDateTime)) {
    throw new AppError('O formato do horário de início é inválido. Use o formato ISO 8601.', 422 );
  }  
  if (!clientId || typeof clientId!=='string' || clientId.trim() === '' ) {
    throw new AppError('O cliente é obrigatório', 422 );
  }
  
  if (clientId.length !== 24) {
    throw new AppError('O ID do cliente deve ter exatamente 24 caracteres.', 422 );
  }
  if (!adminId || typeof adminId!=='string' || adminId.trim() === '') {
    throw new AppError('O profissional é obrigatório', 422 );
  }
  if (adminId.length !== 24) {
    throw new AppError('O ID do profissional deve ter exatamente 24 caracteres.', 422 );
  }
  if (!serviceIds ||!Array.isArray(serviceIds) || serviceIds.length === 0) {
    throw new AppError('Pelo menos um serviço deve ser selecionado.', 422 );
  }
  if (!serviceIds.every(id => typeof id === 'string' && id.trim() !== '')) {
    throw new AppError('Cada ID de serviço na lista deve ser uma string válida.', 422);
  }
  if (!serviceIds.every(id => id.length === 24)) {
    throw new AppError('Cada ID de serviço deve ter exatamente 24 caracteres.', 422);
  }  
  return;
}

export function validateUpdateBookingData(data: BookingPayload): void {
  const { startDateTime, clientId, adminId, serviceIds } = data;

  if (startDateTime && !isValidISODate(startDateTime)) {
    throw new AppError('O formato do horário de início é inválido. Use o formato ISO 8601.', 422);
  }

  if (clientId && (typeof clientId !== 'string' || clientId.trim() === '' || clientId.length !== 24)) {
    throw new AppError('O ID do cliente deve ser uma string válida com exatamente 24 caracteres.', 422);
  }

  if (adminId && (typeof adminId !== 'string' || adminId.trim() === '' || adminId.length !== 24)) {
    throw new AppError('O ID do profissional deve ser uma string válida com exatamente 24 caracteres.', 422);
  }

  if (serviceIds && (!Array.isArray(serviceIds) || serviceIds.length === 0 || !serviceIds.every(id => typeof id === 'string' && id.trim() !== '' && id.length === 24))) {
    throw new AppError('Cada ID de serviço deve ser uma string válida com exatamente 24 caracteres.', 422);
  }
    
}