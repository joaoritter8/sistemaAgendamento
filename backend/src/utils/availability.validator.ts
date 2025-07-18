import { AvailabilityCreatePayload, AvailabilityUpdatePayload } from "../types/availability.types";
import userService from "../services/users.service";
import AppError from "./AppError";
import { isValidISODate } from "./validators";

export async function validateAvailability(data: AvailabilityCreatePayload): Promise<void> {
    if (!data.startDate) {
       throw new AppError("Data e hora de início são obrigatórios", 422);
    }
    if(!isValidISODate(data.startDate)) {
        throw new AppError("O formato do horário de início é inválido. Use o formato ISO 8601.", 422);
    }
    if (!data.endDate) {
        throw new AppError("Data e hora de término são obrigatórios", 422);
    }
    if(!isValidISODate(data.endDate)) {
        throw new AppError("O formato do horário de término é inválido. Use o formato ISO 8601.", 422);
    }
    if (!data.adminId) {
        throw new AppError("Usuário é obrigatório", 422);4
    }
    if (data.adminId!== "string" || data.adminId.trim() === "" || data.adminId.length!== 24) {
        throw new AppError("O ID do profissional deve ser uma string válida", 422);
    }
    if (new Date(data.startDate) >= new Date(data.endDate)) {
        throw new AppError("A data de início deve ser anterior à data de término", 422);
    }
    const user = await userService.findById(data.adminId);  
    if (!user) {
       throw new AppError("Usuário não encontrado", 404);
    }    
}

export function validateUpdateAvailability(data: AvailabilityUpdatePayload): void {

    if (data.startDate && !isValidISODate(data.startDate)) {
        throw new AppError("O formato do horário de início é inválido. Use o formato ISO 8601.", 422);
    }
    if (data.endDate && !isValidISODate(data.endDate)) {
        throw new AppError("O formato do horário de término é inválido. Use o formato ISO 8601.", 422);
    }
    if (data.adminId && (typeof data.adminId !== "string" || data.adminId.trim() === "" || data.adminId.length !== 24)) {
        throw new AppError("O ID do profissional deve ser uma string válida", 422);
    }
    if (data.startDate && new Date(data.startDate) >= new Date(data.endDate)) {
        throw new AppError("A data de início deve ser anterior à data de término", 422);
    }
}