import ObjectId from 'mongoose';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { format } from 'date-fns';

import validateDate from '../../utils/ValidateDate';
import AppError from '../../errors/AppError';
import {
  IClientBody,
  IClientFilters,
  IClientResponse,
  IClientResponsePageable,
  IClientUpdate,
} from '../interfaces/IClient';
import ClientRepository from '../repository/ClientRepository';
import isValidCPF from '../../utils/isValidCPF';

class ClientService {
  async create({
    name,
    cpf,
    birthday,
    email,
    password,
    cep,
    number,
  }: IClientBody): Promise<IClientResponse> {
    const cpfFormat = cpf.replace(/\D/g, '');

    if (!isValidCPF(cpfFormat)) {
      throw new AppError('Invalid CPF');
    }

    const clientEmail = await ClientRepository.findByEmail(email);
    const clientCPF = await ClientRepository.findByCPF(cpfFormat);

    if (clientEmail.length > 0 || clientCPF.length > 0) {
      throw new AppError('Email or CPF already in use!');
    }

    const date = validateDate(birthday);
    const passwordHash = await hash(password, 8);

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    if (data.erro) {
      throw new AppError('Invalid CEP');
    }

    const cepFormat = cep.replace(/\D/g, '');

    const result = await ClientRepository.create({
      name,
      cpf: cpfFormat,
      birthday: date,
      email,
      password: passwordHash,
      cep: cepFormat,
      uf: data.uf,
      city: data.localidade,
      address: data.logradouro,
      number,
      complement: data.complemento,
      neighborhood: data.bairro,
    });

    return this.findById(result._id.toString());
  }

  async find(filters: IClientFilters): Promise<IClientResponsePageable> {
    const result = await ClientRepository.find({
      name: filters.name ? filters.name.trim() : filters.name,
      cpf: filters.cpf ? filters.cpf.trim().replace(/\D/g, '') : filters.cpf,
      birthday: filters.birthday
        ? validateDate(filters.birthday.toString())
        : filters.birthday,
      email: filters.email ? filters.email.trim() : filters.email,
      cep: filters.cep ? filters.cep.replace(/\D/g, '') : filters.cep,
      uf: filters.uf ? filters.uf.trim() : filters.uf,
      address: filters.address ? filters.address.trim() : filters.address,
      city: filters.city ? filters.city.trim() : filters.city,
      neighborhood: filters.neighborhood
        ? filters.neighborhood.trim()
        : filters.neighborhood,
      complement: filters.complement
        ? filters.complement.trim()
        : filters.complement,
      number: filters.number ? +filters.number : filters.number,
      page: filters.page ? +filters.page : 1,
      size: filters.size ? +filters.size : 10,
    });

    if (result.docs.length === 0) {
      throw new AppError('No data found for your search');
    }

    const clients: IClientResponse[] = [];

    for (let i = 0; i < result.docs.length; i++) {
      clients.push({
        _id: result.docs[i]._id,
        name: result.docs[i].name,
        cpf: result.docs[i].cpf.replace(
          /(\d{3})(\d{3})(\d{3})(\d{2})/,
          '$1.$2.$3-$4',
        ),
        birthday: format(new Date(result.docs[i].birthday), 'dd/MM/yyyy'),
        email: result.docs[i].email,
        cep: result.docs[i].cep.replace(/(\d{5})(\d{3})/, '$1-$2'),
        uf: result.docs[i].uf,
        city: result.docs[i].city,
        address: result.docs[i].address,
        number: result.docs[i].number,
        complement: result.docs[i].complement,
        neighborhood: result.docs[i].neighborhood,
      });
    }

    return {
      clients,
      currentPage: result.page,
      pageSize: result.limit,
      totalCount: result.totalDocs,
      totalPages: result.totalPages,
    };
  }

  async findById(id: string): Promise<IClientResponse> {
    const client = await this.validateIDClient(id);

    return {
      ...client,
      birthday: format(new Date(client.birthday), 'dd/MM/yyyy'),
      cep: client.cep.replace(/(\d{5})(\d{3})/, '$1-$2'),
      cpf: client.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
    };
  }

  async update(
    id: string,
    { name, birthday, password, cep, number }: IClientUpdate,
  ): Promise<IClientResponse> {
    await this.validateIDClient(id);

    const client: IClientUpdate = {};
    if (name) {
      client.name = name;
    }
    if (birthday) {
      client.birthday = validateDate(birthday.toString());
    }

    if (password) {
      client.password = await hash(password, 8);
    }

    if (cep) {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

      if (data.erro) {
        throw new AppError('Invalid CEP');
      }

      client.cep = cep.replace(/\D/g, '');

      client.uf = data.uf;
      client.city = data.localidade;
      client.address = data.logradouro;
      client.complement = data.complemento;
      client.neighborhood = data.bairro;
    }

    if (number) {
      client.number = number;
    }

    await ClientRepository.update(id, client);

    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.validateIDClient(id);

    await ClientRepository.remove(id);
  }

  private async validateIDClient(id: string): Promise<IClientResponse> {
    if (!ObjectId.isValidObjectId(id)) {
      throw new AppError('Id entered is not valid');
    }
    const client = await ClientRepository.findById(id);

    if (client.length === 0) {
      throw new AppError('Client not found', 404, 'Not Found');
    }

    return client[0];
  }
}

export default new ClientService();
