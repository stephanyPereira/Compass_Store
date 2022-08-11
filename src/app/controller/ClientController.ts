import ClientService from '../service/ClientService';

class ClientController {
  async create(req, res) {
    const { name, cpf, birthday, email, password, cep, number } = req.body;
    const result = await ClientService.create({
      name,
      cpf,
      birthday,
      email,
      password,
      cep,
      number,
    });
    return res.status(201).json(result);
  }

  async findById(req, res) {
    const { id } = req.params;

    const result = await ClientService.findById(id);

    return res.status(201).json(result);
  }
}

export default new ClientController();
