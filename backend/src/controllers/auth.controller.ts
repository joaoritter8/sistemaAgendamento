import authService from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../types/auth.types';
import { isValidEmail } from '../utils/validators';
import AppError from '../utils/AppError';

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: AuthPayload = req.body;

    // Validações
    if (!isValidEmail(email)) {
      throw new AppError('Email inválido', 422);
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      throw new AppError('A senha é obrigatória', 422);
    }
    const user = await authService.login({ email, password });

    // Retorna o usuário sem a senha
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }

}
export default { login };