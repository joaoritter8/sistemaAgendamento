import { NextFunction, Request, Response } from "express";
import availavilityService  from "../services/availability.service";
import userService from "../services/users.service.js";
import { validateAvailability } from "../utils/availability.validator.js";
import AppError from "../utils/AppError.js";

async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate, adminId } = req.body;

    // Validações
    validateAvailability({ startDate, endDate, adminId });

    // Cria a disponibilidade
    const availability = await availavilityService.create({ startDate, endDate, adminId });

    // Retorna a disponibilidade criada
    res.status(201).json(availability);
  } catch (error) {
    next(error)
  }
} 

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const availabilities = await availavilityService.findAll();
    res.status(200).json(availabilities);
  } catch (error) {    
    next(error);
  }
}

async function findAllByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;

    if (userId.length !== 24) {
      throw new AppError("ID inválido", 422);
    }

    const user = await userService.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
    
    const availabilities = await availavilityService.findAllByUserId(userId);
    res.status(200).json(availabilities);
  }  
  catch (error) {    
   next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {  
  try {
    const { id } = req.params;
    const { startDate, endDate, adminId } = req.body;
    if (id.length!== 24) {
      throw new AppError("ID inválido", 422);
    }
    const availability = await availavilityService.findById(id);
    if (!availability) {
      throw new AppError("Disponibilidade não encontrada", 404);
    }
    // Validações
    validateUpdateAvailability({ startDate, endDate, adminId });
    const updatedAvailability = await availavilityService.update(id, { startDate, endDate, adminId });
    res.status(200).json(updatedAvailability);
  } catch (error) {
    next(error);
  }
}



export default { create, findAll, findAllByUserId };