import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js'; 

export async function isAuthenticated(req, res, next){
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado!Token não fornecido ou malformado.'});  
    }
  
    const token = authHeader && authHeader.split(' ')[1];   
    
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }                     
        },
        );

        if (!user) {
        return res.status(401).json({ message: 'Usuário do token não encontrado.' });
        }

        req.user = user;        
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(400).json({ message: 'Token inválido ou expirado!'});
    }
}

export function isAdmin(req, res, next) {
  // Este middleware DEVE rodar DEPOIS do `isAuthenticated`
  if (req.user && req.user.role === 'admin') {
    next(); // O usuário é um admin, pode continuar
  } else {    
    return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
  }
}

