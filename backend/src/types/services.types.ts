export interface ServicePayload {
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;
}

export interface ServiceUpdatePayload {
    name?: string;
    description?: string;
    durationInMinutes?: number;
    price?: number;
}

export interface ServiceResponse {
    id: string;
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;
}