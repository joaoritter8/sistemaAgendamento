import prisma from '../lib/prisma.js';
import { Booking } from '../types/types.js';
import { BookingPayload, BookingResponse } from '../types/booking.types.ts';
import AppError from '../utils/AppError.ts';
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

export default {create};