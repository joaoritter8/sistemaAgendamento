import availavilityService  from "../services/availability.service.js";
import userService from "../services/users.service.js";

async function create(req, res) {
  try {
    const { startDate, endDate, adminId } = req.body;

    // Validações
    if (!startDate) {
      return res.status(422).json({ msg: "Data e hora de início são obrigatórios" });
    }
    if (!endDate) {
      return res.status(422).json({ msg: "Data e hora de término são obrigatórios" });
    }
    if (!adminId) {
      return res.status(422).json({ msg: "Usuário é obrigatório" });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(422).json({ msg: "A data de início deve ser anterior à data de término" });
    }
    // Verifica se o usuário existe
    const user = await userService.findById(adminId);  
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    if(user.role !== "professional" && user.role !== "admin") {
      return res.status(403).json({ msg: "Este usuário não possui permissão para realizar esta ação" });
    }

    // Cria a disponibilidade
    const availability = await availavilityService.create({ startDate, endDate, adminId });

    // Retorna a disponibilidade criada
    res.status(201).json(availability);
  } catch (error) {
    // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
} 

async function findAll(req, res) {
  try {
    const availabilities = await availavilityService.findAll();
    res.status(200).json(availabilities);
  } catch (error) {    
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function findAllByUserId(req, res) {
  try {
    const { userId } = req.params;
    // Validações
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    console.log(user.role);
    if(user.role !== "professional" && user.role !== "admin") {
      return res.status(401).json({ msg: "Este usuário não possui permissão para realizar esta ação" });
    }
    const availabilities = await availavilityService.findAllByUserId(userId);
    res.status(200).json(availabilities);
  }  
  catch (error) {
    
    if (error.code) { 
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}


export default { create, findAll, findAllByUserId };