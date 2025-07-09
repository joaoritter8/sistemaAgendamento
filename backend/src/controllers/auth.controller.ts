import authService from '../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '../types/auth.types';

async function login(req, res) {
  try {
    const { email, password }: AuthPayload = req.body;

    // Validações
    if (!email || !password) {
      return res.status(422).json({ msg: "Email e senha são obrigatórios" });
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(422).json({ msg: "Email inválido" });
    }    

    // Tenta fazer o login
    const user = await authService.login({ email, password });

    // Retorna o usuário sem a senha
    res.status(200).json(user);
  } catch (error) {
    // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

export default { login };