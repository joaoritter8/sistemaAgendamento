import prisma from '../lib/prisma.js';

async function create({ name, description, price, durationInMinutes}) {

  const existingService = await prisma.service.findFirst({
    where: {
      name
    },
  });

  if (existingService) {
    const error = new Error('Já existe um serviço com esse nome');
    error.code = 422;
    throw error;
  }

  const newService = await prisma.service.create({
    data: {
      name,
      description,
      price,
      durationInMinutes
    },
  });

  return newService;
}

async function findAll() {
   
  const services = await prisma.service.findMany({});    
  services.sort((a, b) => a.name.localeCompare(b.name));

  return services;
}

async function findByName(name) {
  const service = await prisma.service.findMany({
    where: {
      name :{
        contains: name,
        mode: 'insensitive', // Ignora maiúsculas e minúsculas
      }
    },
  });
  return service;
}

async function update(id, { name, description, price, durationInMinutes }) {
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService) {
    const error = new Error('Serviço não encontrado');
    error.code = 422;
    throw error;
  }

  const updatedService = await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      price,
      durationInMinutes
    },
  });

  return updatedService;
}

async function remove(id) {
  
  const existingService = await prisma.service.findUnique({
    where: { id },
  });

  if (!existingService) {
    const error = new Error('Serviço não encontrado');
    error.code = 404;
    throw error;
  }

  await prisma.service.delete({
    where: { id },
  });

  return existingService;
}


export default {create, findAll, findByName, update, remove};