import prisma from '../lib/prisma.js';
import { ServicePayload, ServiceResponse, ServiceUpdatePayload } from '../types/services.types.js';
import AppError from '../utils/AppError.js';

async function create({ name, description, price, durationInMinutes}: ServicePayload): Promise<ServiceResponse> {

  const existingService = await prisma.service.findFirst({
    where: {
      name
    },
  });

  if (existingService) {
    throw new AppError('Serviço já existe', 409);
  }

  const newService = await prisma.service.create({
    data: {
      name,
      description,
      price,
      durationInMinutes
    },
  });

  return newService as ServiceResponse;
}

async function findAll(): Promise<ServiceResponse[]> {
   
  const services = await prisma.service.findMany({});    
  services.sort((a, b) => a.name.localeCompare(b.name));

  return services as ServiceResponse[];
}

async function findByName(name: string): Promise<ServiceResponse[]> {
  const services = await prisma.service.findMany({
    where: {
      name :{
        contains: name,
        mode: 'insensitive', // Ignora maiúsculas e minúsculas
      }
    },
  });

  if(!services || services.length === 0) {
    throw new AppError('Nenhum serviço encontrado com esse nome', 404);
  }
  
  return services as ServiceResponse[];
}

async function update(id: string, dataToUpdate: ServiceUpdatePayload): Promise<ServiceResponse> {
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService) {
    throw new AppError('Serviço não encontrado', 404);
  }

  const updatedService = await prisma.service.update({
    where: { id },
    data: dataToUpdate,
  });

  return updatedService as ServiceResponse;
}

async function remove(id: string): Promise<ServiceResponse> {
  
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService) {
    throw new AppError('Serviço não encontrado', 404);
  }

  if(existingService.serviceBookingIds.length > 0){
    throw new AppError('Serviço possui agendamentos. Não é possível excluí-lo.', 409);
  }

  await prisma.service.delete({
    where: { id },
  });

  return existingService as ServiceResponse;
}


export default {create, findAll, findByName, update, remove};