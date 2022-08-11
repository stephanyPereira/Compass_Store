import { Types } from 'mongoose';
import { IClient, IClientResponse } from '../interfaces/IClient';
import ClientSchema from '../schema/ClientSchema';

class ClientRepository {
  async create(payload: IClient): Promise<IClientResponse> {
    return ClientSchema.create(payload);
  }

  async findById(id: string): Promise<IClientResponse[]> {
    return ClientSchema.aggregate()
      .match({
        _id: new Types.ObjectId(id),
      })
      .project({
        _id: '$_id',
        name: '$name',
        cpf: '$cpf',
        birthday: '$birthday',
        email: '$email',
        cep: '$cep',
        uf: '$uf',
        city: '$city',
        address: '$address',
        number: '$number',
        complement: '$complement',
        neighborhood: '$neighborhood',
      });
  }

  async findByEmail(email: string): Promise<IClient[]> {
    return ClientSchema.find({ email });
  }

  async findByCPF(cpf: string): Promise<IClient[]> {
    return ClientSchema.find({ cpf });
  }
}

export default new ClientRepository();
