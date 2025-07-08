export interface BookingPayload { 
    startDateTime: string;
    clientId: string;
    adminId: string;
    serviceIds: string[];
}

export interface BookingResponse {
    id: string;
    createdAt: Date;
    startDateTime: Date;
    endDateTime: Date;
    totalPrice: number;
    client: {
        id: string;
        name: string;
    };
    professional: {
        id: string;
        name: string;
    };
    services: {
        id: string;
        name: string;
    }[];
}