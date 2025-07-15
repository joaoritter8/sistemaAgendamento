import { ServicePayload, ServiceUpdatePayload } from "../types/services.types";
import AppError from "./AppError";

export function validateServiceData(data: ServicePayload): void {
  const { name, description, durationInMinutes, price } = data;
  if (!name || name.trim() === '' || typeof name!=='string') {
    throw new AppError('O nome do serviço é obrigatório', 422);
  }
  if (!description || description.trim() === '' || typeof description!=='string') {
    throw new AppError('A descrição do serviço é obrigatória', 422);
  }
  if (!durationInMinutes) {
    throw new AppError('A duração do serviço é obrigatória', 422);
  }
  if (isNaN(durationInMinutes)) {
    throw new AppError('A duração do serviço deve ser um número', 422);
  }
  if (durationInMinutes <= 0) {
    throw new AppError('A duração do serviço deve ser maior que zero', 422);
  }
  if (durationInMinutes % 30 !== 0) {
    throw new AppError('A duração do serviço deve ser um múltiplo de 30 minutos', 422);
  }
  if (!price) {
    throw new AppError('O preço do serviço é obrigatório', 422);
  }
  if (isNaN(price)) {
    throw new AppError('O preço do serviço deve ser um número', 422);
  }
}

export function validateUpdateServiceData(dataToUpdate: ServiceUpdatePayload): void {
  const { name, description, durationInMinutes, price } = dataToUpdate;
  
  if (name && (typeof name !== 'string' || name.trim() === '')) {
    throw new AppError('O nome do serviço deve ser uma string não vazia', 422);
  }
  
  if (description && (typeof description !== 'string' || description.trim() === '')) {
    throw new AppError('A descrição do serviço deve ser uma string não vazia', 422);
  }
  
  if (durationInMinutes !== undefined) {
    if (isNaN(durationInMinutes) || durationInMinutes <= 0 || durationInMinutes % 30 !== 0) {
      throw new AppError('A duração do serviço deve ser um número maior que zero e um múltiplo de 30 minutos', 422);
    }
  }
  
  if (price !== undefined) {
    if (isNaN(price)) {
      throw new AppError('O preço do serviço deve ser um número', 422);
    }
  }
}