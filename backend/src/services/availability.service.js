import prisma from '../lib/prisma.js';

async function create({ startDate, endDate, adminId }) {

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const error = new Error('Formato de data inválido');
      error.code = 422;
      throw error;
    }
    
    const existingAvailability = await prisma.availability.findFirst({
        where: {
          adminId,
          OR: [
              {
                  startDate: {
                      lte: new Date(endDate),
                  },
                  endDate: {
                      gte: new Date(startDate),
                  },
              },
              {
                  startDate: {
                      gte: new Date(startDate),
                  },
                  endDate: {
                      lte: new Date(endDate),
                  },
              },
          ],
        },
    });

    if (existingAvailability && existingAvailability.adminId === adminId) {
      const error = new Error('Já existe uma disponibilidade com essas datas para este usuário');
      error.code = 422;
      throw error;
    }
    // Cria a disponibilidade
    const availability = await prisma.availability.create({
        data: {
            startDate,
            endDate,
            adminId,            
        },
    });

    return availability;
}

async function findAll(){
  return await prisma.availability.findMany().then(availabilities => {
    const allAvailabilities = []; 
    availabilities.map(availability => {
      if(allAvailabilities.find(a => a.adminId === availability.adminId)) {
        allAvailabilities.find(a => a.adminId === availability.adminId).availabilities.push(availability);
      }
      else {
        allAvailabilities.push({
          adminId: availability.adminId,
          availabilities: [availability]
        });
      };
    });
    return allAvailabilities;
  });
}

async function findAllByUserId(adminId) {
  const availabilities= await prisma.availability.findMany({
    where: { adminId },
  });

  if (!availabilities || availabilities.length === 0) {
    return [];
  }

  return availabilities;
}




export default {create, findAll, findAllByUserId};