import ClientService from '../service/ClientService';

class ClientController {
  async create(req, res) {
    try {
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
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new ClientController();
