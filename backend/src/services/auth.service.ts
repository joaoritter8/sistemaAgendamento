import prisma from '../lib/prisma'; // Usando a instância centralizada
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

async function login({ email, password }) {
  // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
      
    }

  // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Senha incorreta', 401);    
    }


    if (!process.env.JWT_SECRET) {
        throw new AppError('JWT_SECRET não está definido nas variáveis de ambiente', 500);
    }
    const token = jwt.sign(
        {
            id: user.id            
        }, 
        process.env.JWT_SECRET as string,
    );

  
    return {message: 'Autenticado com sucesso', user: { id: user.id, email: user.email, name: user.name, role: user.role }, token: token};
}

export default {login};