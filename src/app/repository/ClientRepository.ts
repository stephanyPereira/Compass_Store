import { Types } from 'mongoose';
import { IClient, IClientResponse, IClientUpdate } from '../interfaces/IClient';
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

  async update(id: string, update: IClientUpdate): Promise<void> {
    await ClientSchema.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      update,
    );
  }

  async remove(id: string): Promise<void> {
    await ClientSchema.deleteOne({ _id: new Types.ObjectId(id) });
  }
}

export default new ClientRepository();
