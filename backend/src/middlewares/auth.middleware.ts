import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma'; 
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError('Token de autenticação não fornecido', 401);
    }

    const token = authHeader && authHeader.split(' ')[1];

    try {
        if (!process.env.JWT_SECRET) {
            throw new AppError('JWT_SECRET não está definido nas variáveis de ambiente', 500);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        (req as any).user = user;
        next();
    } catch (error) {
        console.error(error.message);
        throw new AppError('Token inválido ou expirado', 401);
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  // Este middleware DEVE rodar DEPOIS do `isAuthenticated`
  if ((req as any).user && (req as any).user && (req as any).user.role === 'admin') {
    next(); // O usuário é um admin, pode continuar
  } else {    
    throw new AppError('Acesso negado. Usuário não é um administrador.', 403);
  }
}

export function isClient(req: Request, res: Response, next: NextFunction): void {
    // Este middleware DEVE rodar DEPOIS do `isAuthenticated`
    if ((req as any).user && (req as any).user.role === 'client') {
        next(); // O usuário é um cliente, pode continuar
    } else {
        throw new AppError('Acesso negado. Usuário não é um cliente.', 403);
    }
}

export function isClientOrAdmin(req: Request, res: Response, next: NextFunction): void {
    const user = (req as any).user;
    const userId = req.params.userId;
    if (user.id === userId || user.role === 'admin') {
        next();
    } else {
        throw new AppError('Acesso negado. Usuário não é um cliente ou administrador.', 403);
    } 
}

