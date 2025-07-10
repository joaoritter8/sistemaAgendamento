import prisma from '../lib/prisma'; // Usando a instância centralizada
import bcrypt from 'bcrypt';
import { UserCreatePayload, UserResponse, UserUpdatePayload } from '../types/users.types';
import AppError from '../utils/AppError';

async function create({ email, name, password, role }: UserCreatePayload): Promise<UserResponse> {

  const existingUser = await findByEmail(email);
  
  if (existingUser) {
    throw new AppError('Já existe um usuário com este email', 409);
  }
  
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);


  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  }); 
 
  return newUser as UserResponse;
}

function findByEmail(email: string) {  
  return prisma.user.findUnique({
    where: { email },
    select:{
      id: true
    }
  });
}

async function findAll(): Promise<UserResponse[]> {
  const users = await prisma.user.findMany({select:{id: true, name: true, email: true, role: true}});
  return users as UserResponse[];
}

async function findById(id: string): Promise<UserResponse> {
  if(id.length !=24){
    throw new AppError('ID inválido', 422);
  }
  const user = await prisma.user.findUnique({
    where: { id },
    select:{
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  return user as UserResponse;
}

async function update(id: string,  dataUpdate: UserUpdatePayload): Promise<UserResponse> {

  const existingUser = await prisma.user.findUnique({
    where: { id }, select:{id: true, email:true, password:true}
  });  

  if (!existingUser) {
    throw new AppError('Usuário não encontrado', 404);
  }

  if(dataUpdate.email){

    const userWithEmail = await prisma.user.findUnique({
      where: { dataUpdate.email },
    });
  
    if(userWithEmail && dataUpdate.email !== existingUser.email) {
      throw new AppError('Já existe um usuário com este email', 409);
    }
  }

  if(dataUpdate.password && await bcrypt.compare(dataUpdate.password, existingUser.password)) {
    throw new AppError('A nova senha não pode ser igual à senha atual', 422);
  }

  
  const salt = await bcrypt.genSalt(12);
  dataUpdate.password = dataUpdate.password || existingUser.password; 
  const hashedPassword = await bcrypt.hash(dataUpdate.password, salt);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: dataUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });  

  return updatedUser as UserResponse;
}

async function remove(id: string): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { id }, select: { id: true }
  });

  if (!user) {
    throw new AppError('Usuário não encontrado', 404);
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'Usuário removido com sucesso' };
}

export default { create, findByEmail, findAll, findById, update, remove };