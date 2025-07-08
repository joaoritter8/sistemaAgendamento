import AppError from "./AppError";
import { Request, Response } from "express";

export default function errorHandler(err: AppError, req: Request, res: Response, next: Function) {
  //console.error(err); 
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  res.status(statusCode).json({ message });
}

