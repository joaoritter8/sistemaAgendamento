import { NextFunction, Request, Response } from 'express';
import servicesService from '../services/services.service';
import { validateServiceData, validateUpdateServiceData } from '../utils/service.validator';
import AppError from '../utils/AppError';


async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, description, durationInMinutes, price } = req.body;

    validateServiceData(req.body);

    const newService = await servicesService.create({ name, description, durationInMinutes, price });

    res.status(201).json(newService);
  
  }catch (error) {
    next(error);
  }
}

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await servicesService.findAll();
    res.status(200).json(services);
  } catch (error) {
    next(error);
  }
}

async function findByName(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.params;

    if(!name || typeof name !== 'string' || name.trim() === '') {
      throw new AppError('O nome do serviço é obrigatório', 422);
    }    
    const service = await servicesService.findByName(name.replace(/[&%$#@-]/g, ' '));
    
    res.status(200).json(service);
  } catch (error) {
    next(error);
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, description, durationInMinutes, price } = req.body;
    
    // Validations
    if (!id || typeof id!=='string' || id.trim() === '' || id.length !== 24) {
      return res.status(422).json({ message: 'O ID do serviço é obrigatório' });
    }
    
    validateUpdateServiceData(req.body);

    // Update the service
    const updatedService = await servicesService.update(id, { name, description, durationInMinutes, price });

    res.status(200).json(updatedService);

  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    
    if (!id || typeof id!=='string' || id.trim() === '' || id.length !== 24) {
      return res.status(422).json({ message: 'O ID do serviço é obrigatório' });
    }
    
    await servicesService.remove(id);
    res.status(200).json({message:'Serviço removido com sucesso!'});
  } catch (error) {
    next(error);
  }
}

export default { create, findAll, findByName, update, remove };