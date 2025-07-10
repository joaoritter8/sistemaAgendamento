import { UserRegsiterPayload, UserUpdatePayload } from "../types/users.types";
import AppError from "./AppError";
import { isValidEmail, isValidPassword } from "./validators";

export function validateUserCreateData(data: UserRegsiterPayload): void {
  const { email, name, password, confirmPassword, role } = data;

  
  console.log('Validating user data:', data);
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new AppError('O nome é obrigatório', 422);
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    throw new AppError('O email é obrigatório', 422);
  }
  if (!isValidEmail(email)) {
    throw new AppError('O formato do email é inválido', 422);
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new AppError('A senha é obrigatória', 422);
  }
  if (!isValidPassword(password)) {
    throw new AppError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo', 422);
  }
  if (password !== confirmPassword) {
    throw new AppError('As senhas não coincidem', 422);
  }  
  if (!role || !['admin', 'client', 'professional'].includes(role)) {
    throw new AppError('Tipo do usuário inválido! ', 422);
  }
}

export function validateUserUpdateData(data: UserUpdatePayload): void {
  const { email, name, password, confirmPassword, role } = data;

  if (name && (typeof name !== 'string' || name.trim() === '')) {
    throw new AppError('O nome é obrigatório', 422);
  }
  if (email && (typeof email !== 'string' || email.trim() === '')) {
    throw new AppError('O email é obrigatório', 422);
  }
  if (email && !isValidEmail(email)) {
    throw new AppError('O formato do email é inválido', 422);
  }
  if (password && (typeof password !== 'string' || password.trim() === '')) {
    throw new AppError('A senha é obrigatória', 422);
  }
  if (password && !isValidPassword(password)) {
    throw new AppError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo', 422);
  }
  if (password && password !== confirmPassword) {
    throw new AppError('As senhas não coincidem', 422);
  }
  if (role && !['admin', 'client', 'professional'].includes(role)) {
    throw new AppError('Tipo do usuário inválido! ', 422);
  }
}