export interface AvailabilityCreatePayload {
    startDate: string;
    endDate: string;
    adminId: string;
}

export interface AvailabilityUpdatePayload {
    startDate?: string;
    endDate?: string;
    adminId?: string;
}


export interface AvailabilityResponse{
    id: string;
    startDate: Date;
    endDate: Date;
    adminId?: string;
}


