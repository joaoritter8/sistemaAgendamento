import servicesService from '../services/services.service.js';
import usersService from '../services/users.service.js';

function validateServiceData(data) {
  const { name, description, durationInMinutes, price } = data;
  if (!name) {
    return res.status(422).json({ message: 'O nome do serviço é obrigatório' });
  }
  if (!description) {
    return res.status(422).json({ message: 'A descrição do serviço é obrigatória' });
  }
  if (!durationInMinutes) {
    return res.status(422).json({ message: 'A duração do serviço é obrigatória' });
  }
  if (isNaN(durationInMinutes)) {
    return res.status(422).json({ message: 'A duração do serviço deve ser um número' });
  }
  if (durationInMinutes <= 0) {
    return res.status(422).json({ message: 'A duração do serviço deve ser maior que zero' });
  }
  if (durationInMinutes % 30 !== 0) {
    return res.status(422).json({ message: 'A duração do serviço deve ser um múltiplo de 30 minutos' });
  }
  if (!price) {
    return res.status(422).json({ message: 'O preço do serviço é obrigatório' });
  }
  if (isNaN(price)) {
    return res.status(422).json({ message: 'O preço do serviço deve ser um número' });
  }
}


async function create(req, res) {
  try {
    const { name, description, durationInMinutes, price } = req.body;

    // Validations
    validateServiceData(req.body);
    // Create the service
    const newService = await servicesService.create({ name, description, durationInMinutes, price });

    res.status(201).json(newService);
  
  }catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function findAll(req, res) {
  try {
    const services = await servicesService.findAll();
    res.status(200).json(services);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function findByName(req, res) {
  try {
    const { name } = req.params;
    
    const service = await servicesService.findByName(name.replace(/[&%$#@-]/g, ' '));
    if (!service) {
      return res.status(404).json({ message: 'Nenhum serviço encontrado com esse nome' });
    }
    res.status(200).json(service);
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { name, description, durationInMinutes, price } = req.body;
    
    // Validations
    if (!id) {
      return res.status(422).json({ message: 'O ID do serviço é obrigatório' });
    }
    validateServiceData(req.body);

    // Update the service
    const updatedService = await servicesService.update(id, { name, description, durationInMinutes, price });

    res.status(200).json(updatedService);

  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;    

    await servicesService.remove(id);
    res.status(200).json({message:'Serviço removido com sucesso!'});
  } catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

export default { create, findAll, findByName, update, remove };