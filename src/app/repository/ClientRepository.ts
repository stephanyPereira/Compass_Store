import { PaginateResult, Types } from 'mongoose';
import {
  IClient,
  IClientFilters,
  IClientResponse,
} from '../interfaces/IClient';
import {
  IFiltersClientRepository,
  IFiltersClientService,
} from '../interfaces/IFilters';
import ClientSchema from '../schema/ClientSchema';

class ClientRepository {
  async create(payload: IClient): Promise<IClientResponse> {
    return ClientSchema.create(payload);
  }

  async find(
    filters: IClientFilters,
  ): Promise<PaginateResult<IClientResponse>> {
    const filter = this.filtersWithRegex(filters);

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
      page: filters.page,
      limit: filters.size,
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

  async update(id: string, update: IFiltersClientService): Promise<void> {
    await ClientSchema.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      update,
    );
  }

  async remove(id: string): Promise<void> {
    await ClientSchema.deleteOne({ _id: new Types.ObjectId(id) });
  }

  filtersWithRegex({
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
  }: IClientFilters): IFiltersClientRepository {
    const filter: IFiltersClientRepository = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (cpf) {
      filter.cpf = { $regex: cpf, $options: 'i' };
    }

    if (birthday) {
      filter.birthday = birthday;
    }

    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    if (uf) {
      filter.uf = { $regex: uf, $options: 'i' };
    }

    if (cep) {
      filter.cep = { $regex: cep, $options: 'i' };
    }

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (address) {
      filter.address = { $regex: address, $options: 'i' };
    }

    if (number) {
      filter.number = +number;
    }

    if (complement) {
      filter.complement = { $regex: complement, $options: 'i' };
    }

    if (neighborhood) {
      filter.neighborhood = { $regex: neighborhood, $options: 'i' };
    }

    return filter;
  }
}

export default new ClientRepository();
