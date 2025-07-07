import userService from '../services/users.service.js';

async function create(req, res) {
  try {
    const { email, name, password, confirmPassword, role } = req.body;
    //validations
    if(!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório'});
    }
    if(!email) {
        return res.status(422).json({ msg: 'O email é obrigatório'});
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(422).json({ msg: "Email inválido" });
    }   
    if(!password ||!confirmPassword) {
        return res.status(422).json({ msg: 'Senha e confirmação da senha são obrigatórios'});
    }
    if(password!== confirmPassword) {
        return res.status(422).json({ msg: 'Senhas não conferem'});
    }
    if(role == null || role == undefined) {
       role = 'client'; // Define o papel como 'user' por padrão se não for especificado
    }

    // Verifica se o usuário já existe
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(422).json({ msg: 'Já existe um usuário com este email'});
    }

    // Cria o usuário
    const newUser = await userService.create({ email, name, password, role });
    
    // Remove a senha da resposta
    delete newUser.password;

    res.status(201).json(newUser);
  } catch (error) {     
     // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message }); 
    }   
    res.status(400).json({ message: 'error.message' });
  }
}

async function findAll(req, res) {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function findById(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    res.status(200).json(user);
  }  
  catch (error) {
    // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { email, name, password, confirmPassword, role } = req.body;

    if(!name){
      return res.status(422).json({ msg: 'O nome é obrigatório' });
    }
    if (!email) {
      return res.status(422).json({ msg: 'O email é obrigatório' });
    }
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(422).json({ msg: "Email inválido" });
    }    
    if( !password || !confirmPassword) {
      return res.status(422).json({ msg: 'Senha e confirmação da senha são obrigatórios' });
    }
    if (password !== confirmPassword) {
      return res.status(422).json({ msg: 'Senhas não conferem' });
    }
    if (!role){
      return res.status(422).json({ msg: 'O tipo de usuário é obrigatório' });
    }      
    
    // Atualiza o usuário
    const updatedUser = await userService.update(id, { 
      email: email, 
      name: name, 
      password, // A senha será atualizada
      role: role 
    });  

    res.status(200).json(updatedUser);

  }
  catch (error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}

async function remove(req, res) {
  try{
    const {id} = req.params;
    const user = await userService.findById(id);

    if(!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    await userService.remove(id);
    res.status(200).json({ msg: 'Usuário removido com sucesso' });

  }catch (error) {
    // Tratamento de erro
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    return res.status(400).json({ message: error.message });
  }
}


export default { create, findAll, findById, update, remove };