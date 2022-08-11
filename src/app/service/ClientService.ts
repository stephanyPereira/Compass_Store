import { IClient, IClientResponse } from '../interfaces/IClient';
import ClientRepository from '../repository/ClientRepository';

class ClientService {
  async create(payload: IClient): Promise<IClientResponse> {
    const result = await ClientRepository.create(payload);
    return result;
  }
}

export default new ClientService();
