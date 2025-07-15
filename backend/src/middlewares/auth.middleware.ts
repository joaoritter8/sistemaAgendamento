import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma'; 
import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/AppError';

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado!Token não fornecido ou malformado.' });
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

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  // Este middleware DEVE rodar DEPOIS do `isAuthenticated`
  if ((req as any).user && (req as any).user && (req as any).user.role === 'admin') {
    next(); // O usuário é um admin, pode continuar
  } else {    
    return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }
}

