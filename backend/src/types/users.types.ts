export interface UserCreatePayload {    
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'client' | 'professional';
}

export interface UserRegsiterPayload{
    name: string;
    email: string;  
    password: string;
    confirmPassword: string;
    role: 'admin' | 'client' | 'professional';
}

export interface UserResponse {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'client' | 'professional';
}




//Criar um tipo so para o payload de atualização de usuário
// Isso é útil para evitar que o usuário atualize campos que não deveriam ser atualizados

export interface UserUpdatePayload {
    email?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
    role?: 'admin' | 'client' | 'professional';
}