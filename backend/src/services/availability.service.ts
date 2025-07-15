import prisma from '../lib/prisma';
import { AvailabilityCreatePayload, AvailabilityResponse } from '../types/availability.types';
import AppError from '../utils/AppError';

async function create({ startDate, endDate, adminId }: AvailabilityCreatePayload): Promise<AvailabilityResponse> {

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new AppError('Datas inválidas', 422);    
    }
    
    const existingAvailability = await prisma.availability.findFirst({
        where: {
          adminId,
          OR: [
              {
                  startDate: {
                      lte: end,
                  },
                  endDate: {
                      gte: start,
                  },
              },
              {
                  startDate: {
                      gte: start,
                  },
                  endDate: {
                      lte: end,
                  },
              },
          ],
        },
    });

    if (existingAvailability && existingAvailability.adminId === adminId) {
      throw new AppError('Já existe uma disponibilidade com essas datas para este usuário', 422);    
    }
    // Cria a disponibilidade
    const availability = await prisma.availability.create({
        data: {
            startDate,
            endDate,
            adminId,            
        }       
    });

    return availability as AvailabilityResponse;
}

async function findAll(): Promise<Array<{ adminId: string, availabilities: AvailabilityResponse[] }>>  {
  return await prisma.availability.findMany().then(availabilities => {
    const allAvailabilities: Array<{ adminId: string, availabilities: AvailabilityResponse[] }> = []; 
    availabilities.map(availability => {
      const existingAdminAvailability = allAvailabilities.find(a => a.adminId === availability.adminId);    
      if(existingAdminAvailability) {
        existingAdminAvailability.availabilities.push(availability);
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

async function findAllByUserId(adminId: string): Promise<{ adminId: string, availabilities: AvailabilityResponse[] }> {
  const availabilities= await prisma.availability.findMany({
    where: { adminId },
  });

  if (!availabilities || availabilities.length === 0) {
    return {} as { adminId: string, availabilities: AvailabilityResponse[] };
  }

  const availabilitiesResponse: { adminId: string, availabilities: AvailabilityResponse[] } ={
    adminId,
    availabilities: availabilities.map(availability => ({
      id: availability.id,
      startDate: availability.startDate,
      endDate: availability.endDate,
    }))
  } ;  

  return availabilitiesResponse;
}




export default {create, findAll, findAllByUserId};