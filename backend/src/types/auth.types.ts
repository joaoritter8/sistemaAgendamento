

export interface AuthPayload{
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'client' | 'professional';
}

export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: 'admin' | 'client' | 'professional';
    };
    token: string;
}


declare global {
  namespace Express {
    export interface Request {
      user?: AuthResponse;
    }
  }
}