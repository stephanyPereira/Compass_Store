import { IClient, IClientResponse } from '../interfaces/IClient';
import ClientSchema from '../schema/ClientSchema';

class ClientRepository {
  async create(payload: IClient): Promise<IClientResponse> {
    return ClientSchema.create(payload);
  }

  async findByEmail(email: string): Promise<IClient[]> {
    return ClientSchema.find({ email });
  }

  async findByCPF(cpf: string): Promise<IClient[]> {
    return ClientSchema.find({ cpf });
  }
}

export default new ClientRepository();
