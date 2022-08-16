import { PaginateResult, Types } from 'mongoose';
import filterData from '../../utils/FilterData';
import {
  IClient,
  IClientFilters,
  IClientResponse,
  IClientUpdate,
} from '../interfaces/IClient';
import { IFilter } from '../interfaces/IFilters';
import ClientSchema from '../schema/ClientSchema';

class ClientRepository {
  async create(payload: IClient): Promise<IClientResponse> {
    return ClientSchema.create(payload);
  }

  async find({
    name,
    cpf,
    birthday,
    email,
    cep,
    uf,
    city,
    address,
    number,
    complement,
    neighborhood,
    page,
    size,
  }: IClientFilters): Promise<PaginateResult<IClientResponse>> {
    const parsedFilters: IFilter[] = [
      {
        field: 'name',
        value: name,
        regex: { $regex: name, $options: 'i' },
      },
      {
        field: 'cpf',
        value: cpf,
        regex: { $regex: cpf, $options: 'i' },
      },
      {
        field: 'birthday',
        value: birthday,
        regex: birthday,
      },
      {
        field: 'email',
        value: email,
        regex: { $regex: email, $options: 'i' },
      },
      {
        field: 'uf',
        value: uf,
        regex: { $regex: uf, $options: 'i' },
      },
      {
        field: 'cep',
        value: cep,
        regex: { $regex: cep, $options: 'i' },
      },
      {
        field: 'city',
        value: city,
        regex: { $regex: city, $options: 'i' },
      },
      {
        field: 'address',
        value: address,
        regex: { $regex: address, $options: 'i' },
      },
      {
        field: 'number',
        value: number,
        regex: number,
      },
      {
        field: 'complement',
        value: complement,
        regex: { $regex: complement, $options: 'i' },
      },
      {
        field: 'neighborhood',
        value: neighborhood,
        regex: { $regex: neighborhood, $options: 'i' },
      },
    ];

    const filter = filterData(parsedFilters);

    const options = {
      select: {
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
      },
      page,
      limit: size,
    };

    return ClientSchema.paginate(filter, options);
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

  async update(
    id: string,
    update: IClientUpdate,
  ): Promise<IClientResponse | null> {
    return ClientSchema.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      update,
    );
  }

  async remove(id: string): Promise<null> {
    return ClientSchema.findByIdAndDelete({ _id: new Types.ObjectId(id) });
  }
}

export default new ClientRepository();
