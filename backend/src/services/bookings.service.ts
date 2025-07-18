import prisma from '../lib/prisma.js';
import { Booking } from '../types/types.js';
import { BookingPayload, BookingResponse } from '../types/booking.types';
import AppError from '../utils/AppError';
import { addMinutes } from 'date-fns';

async function create(bookingData: BookingPayload): Promise<BookingResponse> {

    const { startDateTime, clientId, adminId, serviceIds } = bookingData; 
    
    const client = await prisma.user.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        throw new AppError('Cliente não encontrado', 404);
    }

    const admin = await prisma.user.findUnique({
        where: { id: adminId },
    });

    if (!admin) {
        throw new AppError('Profissional não encontrado', 404);
    }

    const services = await prisma.service.findMany({
        where: {
        id: {
            in: serviceIds,
        },
        },
    });

    if (!services || services.length !== serviceIds.length) {
        throw new AppError('Alguns serviços não foram encontrados', 404);
    }

    
    const totalPrice = services.reduce((total, service) => total + service.price, 0);
    const totalDuration = services.reduce((total, service) => total + service.durationInMinutes, 0);
    const bookingStartTime = new Date(startDateTime);
    const bookingEndTime = addMinutes(bookingStartTime, totalDuration);   
    
    const availability= await prisma.availability.findFirst({
        where: {
        adminId,
        startDate: {lte: bookingStartTime},
        endDate: {gte: bookingEndTime},
        },
    });

    if (!availability) {
        throw new AppError('O profissional não está disponível nessa data e horário', 422);
    }

    const conflictingBooking = await prisma.booking.findFirst({
        where: {
        adminId,
        startDateTime: { lte: bookingEndTime },
        endDateTime: { gte: bookingStartTime },
        },
    });

    if (conflictingBooking) {
        throw new AppError('Já existe um agendamento nesse horário para o profissional', 422);
    }


    

    const booking = await prisma.booking.create({
        data: {
        createdAt: new Date(),
        startDateTime,
        endDateTime: bookingEndTime.toISOString(),
        totalPrice,
        client: { connect: { id: clientId } },
        admin: { connect: { id: adminId } },
        services: { connect: serviceIds.map(id => ({ id })) },
        },
    });

    return {
        id: booking.id,
        createdAt: booking.createdAt,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        totalPrice: booking.totalPrice,
        client: {
            id: client.id,
            name: client.name,
        },
        professional: {
            id: admin.id,
            name: admin.name,
        },
        services: services.map(service => ({
            id: service.id,
            name: service.name,
        })),
    };
 
}

async function findAll(): Promise<BookingResponse[]> {
    return prisma.booking.findMany({
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
            admin: {
                select: {
                    id: true,
                    name: true,
                },
            },
            services: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    }).then(bookings => bookings.map(booking => ({
        id: booking.id,
        createdAt: booking.createdAt,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        totalPrice: booking.totalPrice,
        client: booking.client,
        professional: booking.admin,
        services: booking.services,
    })));
}

async function findAllByUserId(userId: string): Promise<BookingResponse[]> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '' || userId.length !== 24) {
        throw new AppError('O ID do usuário é obrigatório', 422);
    }

    return prisma.booking.findMany({
        where: {
            clientId: userId,
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
            admin: {
                select: {
                    id: true,
                    name: true,
                },
            },
            services: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    }).then(bookings => bookings.map(booking => ({
        id: booking.id,
        createdAt: booking.createdAt,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        totalPrice: booking.totalPrice,
        client: booking.client,
        professional: booking.admin,
        services: booking.services,
    })));
}

async function findAllByProfessionalId(professionalId: string): Promise<BookingResponse[]> {
    if (!professionalId || typeof professionalId !== 'string' || professionalId.trim() === '' || professionalId.length !== 24) {
        throw new AppError('O ID do profissional é obrigatório', 422);
    }
    return prisma.booking.findMany({
        where: {
            adminId: professionalId,
        },
        include: {
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
            admin: {
                select: {
                    id: true,
                    name: true,
                },
            },
            services: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    }).then(bookings => bookings.map(booking => ({
        id: booking.id,
        createdAt: booking.createdAt,
        startDateTime: booking.startDateTime,
        endDateTime: booking.endDateTime,
        totalPrice: booking.totalPrice,
        client: booking.client,
        professional: booking.admin,
        services: booking.services,
    })));
}

async function remove(id: string): Promise<void> {
  
    const booking = await prisma.booking.findUnique({
        where: { id },
    });

    if (!booking) {
        throw new AppError('Agendamento não encontrado', 404);
    }

    await prisma.booking.delete({
        where: { id },
    });
}

async function update(id: string, data: BookingPayload): Promise<BookingResponse> {

    const { startDateTime, clientId, adminId, serviceIds } = data; 

    const booking = await prisma.booking.findUnique({
        where: { id },
    });
    if (!booking) {
        throw new AppError('Agendamento não encontrado', 404);
    }
    
    const client = await prisma.user.findUnique({
        where: { id: clientId },
    });

    if (!client) {
        throw new AppError('Cliente não encontrado', 404);
    }

    const admin = await prisma.user.findUnique({
        where: { id: adminId },
    });

    if (!admin) {
        throw new AppError('Profissional não encontrado', 404);
    }

    const services = await prisma.service.findMany({
        where: {
        id: {
            in: serviceIds,
        },
        },
    });

    if (!services || services.length !== serviceIds.length) {
        throw new AppError('Alguns serviços não foram encontrados', 404);
    }

    
    const totalPrice = services.reduce((total, service) => total + service.price, 0);
    const totalDuration = services.reduce((total, service) => total + service.durationInMinutes, 0);
    const bookingStartTime = new Date(startDateTime);
    const bookingEndTime = addMinutes(bookingStartTime, totalDuration);   
    
    const availability= await prisma.availability.findFirst({
        where: {
        adminId,
        startDate: {lte: bookingStartTime},
        endDate: {gte: bookingEndTime},
        },
    });

    if (!availability) {
        throw new AppError('O profissional não está disponível nessa data e horário', 422);
    }

    const conflictingBooking = await prisma.booking.findFirst({
        where: {
        adminId,
        startDateTime: { lte: bookingEndTime },
        endDateTime: { gte: bookingStartTime },
        },
    });

    if (conflictingBooking) {
        throw new AppError('Já existe um agendamento nesse horário para o profissional', 422);
    }


    

    const updatedBooking = await prisma.booking.create({
        data: {
        createdAt: new Date(),
        startDateTime,
        endDateTime: bookingEndTime.toISOString(),
        totalPrice,
        client: { connect: { id: clientId } },
        admin: { connect: { id: adminId } },
        services: { connect: serviceIds.map(id => ({ id })) },
        },
    });

    return {
        id: updatedBooking.id,
        createdAt: updatedBooking.createdAt,
        startDateTime: updatedBooking.startDateTime,
        endDateTime: updatedBooking.endDateTime,
        totalPrice: updatedBooking.totalPrice,
        client: {
            id: client.id,
            name: client.name,
        },
        professional: {
            id: admin.id,
            name: admin.name,
        },
        services: services.map(service => ({
            id: service.id,
            name: service.name,
        })),
    };
}



export default {create, findAll, findAllByUserId, findAllByProfessionalId, remove, update};