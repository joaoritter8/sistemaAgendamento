import { AuthPayload } from "../types/auth.types";
import AppError from "./AppError";
import { isValidEmail, isValidPassword } from "./validators";

export function validadeAuth(userData: AuthPayload): void {
  const { email, password } = userData;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    throw new AppError('O email é obrigatório', 422);
  }
  if (!isValidEmail(email)) {
    throw new AppError('O formato do email é inválido', 422);
  }
  if (!password || typeof password !== 'string' || password.trim() === '') {
    throw new AppError('A senha é obrigatória', 422);
  }
    
}