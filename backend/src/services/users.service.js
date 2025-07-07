import prisma from '../lib/prisma.js'; // Usando a instância centralizada
import bcrypt from 'bcrypt';

async function create({ email, name, password, role }) {
  // Lógica de negócio: Hashear a senha antes de salvar
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  return newUser;
}

function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function findAll() {
  const users = await prisma.user.findMany({});

  users.forEach(user => {
    delete user.password; 
  });

  return users
}

async function findById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.code = 404;
    throw error;
  }

  delete user.password; 

  return user;
}

async function update(id, { email, name, password, role}) {

  const existingUser = await prisma.user.findUnique({
    where: { id },
  });  

  if (!existingUser) {
    const error = new Error('Usuário não encontrado');
    error.code = 422;
    throw error;
  }

  const userWithEmail = await prisma.user.findUnique({
    where: { email },
  });

  if(userWithEmail && email !== existingUser.email) {
    const error = new Error('Já existe um usuário com este email');
    error.code = 422;
    throw error;
  }

  if(await bcrypt.compare(password, existingUser.password)) {
    const error = new Error('A nova senha não pode ser a mesma que a atual');
    error.code = 422;
    throw error;
  }

  // Lógica de negócio: Hashear a senha antes de atualizar
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      email,
      name,
      password: hashedPassword,
      role,
    },
  });

  delete updatedUser.password;

  return updatedUser;
}

async function remove(id) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    const error = new Error('Usuário não encontrado');
    error.code = 404;
    throw error;
  }

  await prisma.user.delete({
    where: { id },
  });

  return { message: 'Usuário removido com sucesso' };
}

export default { create, findByEmail, findAll, findById, update, remove };