import { Request, Response } from 'express';
import { IClientFilters } from '../interfaces/IClient';
import ClientService from '../service/ClientService';

class ClientController {
  async create(req: Request, res: Response) {
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

  async find(req: Request, res: Response) {
    const result = await ClientService.find(req.query as IClientFilters);

    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ClientService.findById(id);

    return res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ClientService.update(id, req.body);

    return res.status(200).json(result);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ClientService.remove(id);

    return res.status(204).json(result);
  }
}

export default new ClientController();
