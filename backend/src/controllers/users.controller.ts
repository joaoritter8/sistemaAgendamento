import { Request, Response, NextFunction } from 'express';
import userService from '../services/users.service.js';
import { UserCreatePayload, UserUpdatePayload } from '../types/users.types';
import { validateUserCreateData, validateUserUpdateData } from '../utils/user.validator.js';
import AppError from '../utils/AppError.js';


async function create(req: Request, res: Response, next: NextFunction) {
  try {   

    const {name, email, password, role }: UserCreatePayload = req.body;
    validateUserCreateData(req.body);
    
    console.log(req.body);
    const newUser = await userService.create({ email, name, password, role }); 
    
    res.status(201).json(newUser);
  } catch (error) {     
    next(error);
  }
}

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

async function findById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      throw new AppError('ID inválido', 422);
    }
    const user = await userService.findById(id);
    res.status(200).json(user);
  }  
  catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if( id.length !== 24) {
      throw new AppError('ID inválido', 422);
    }
    const { email, name, password, confirmPassword, role }: UserUpdatePayload = req.body;

    validateUserUpdateData(req.body);     
    
    // Atualiza o usuário
    const updatedUser = await userService.update(id, { 
      email, 
      name, 
      password, 
      confirmPassword,
      role
    });  

    res.status(200).json(updatedUser);

  }
  catch (error) {
   next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try{
    const {id} = req.params;
    if(id.length !== 24) {
      throw new AppError('ID inválido', 422);
    }
    const user = await userService.findById(id);

    if(!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    await userService.remove(id);
    res.status(200).json({ message: 'Usuário removido com sucesso' });

  }catch (error) {
   next(error);
  }
}


export default { create, findAll, findById, update, remove };