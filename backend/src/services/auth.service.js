import prisma from '../lib/prisma.js'; // Usando a instância centralizada
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function login({ email, password }) {
  // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.code = 404;
      throw error;
    }

  // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Senha incorreta');
      error.code = 401;
      throw error;
    }


    const token = jwt.sign({
        id: user.id            
    }, 
    process.env.JWT_SECRET,
    );

  
  return {message: 'Autenticado com sucesso', user: { id: user.id, email: user.email, name: user.name, role: user.role }, token: token};
}

export default {login};