export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'client' | 'professional';
}

export interface Availability {
    id: string;
    userId: number;
    startDate: string; 
    endDate: string; 
    adminId: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;

    serviceBookingIds: string[];
    serviceBookings: Booking[];
}





export interface Booking {
    id: string;
    createdAt: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    
    clientId: string;
    client: User;
    adminId: string;
    admin: User;
    serviceIds: [string];
    services: Service[];
}