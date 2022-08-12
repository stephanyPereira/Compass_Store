import {
  formatCEP,
  formatCPF,
  isValidCEP,
  isValidCPF,
} from '@brazilian-utils/brazilian-utils';
import ObjectId from 'mongoose';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { format } from 'date-fns';

import validateDate from '../../utils/ValidateDate';
import AppError from '../../errors/AppError';
import {
  IClientBody,
  IClientResponse,
  IClientUpdate,
} from '../interfaces/IClient';
import ClientRepository from '../repository/ClientRepository';

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
    if (!isValidCPF(cpf)) {
      throw new AppError('Invalid CPF');
    }

    const cpfFormat = cpf.replace(/\D/g, '');

    const clientEmail = await ClientRepository.findByEmail(email);
    const clientCPF = await ClientRepository.findByCPF(cpfFormat);

    if (clientEmail.length > 0 || clientCPF.length > 0) {
      throw new AppError('Email or CPF already in use!');
    }

    const date = validateDate(birthday);
    const passwordHash = await hash(password, 8);

    if (!isValidCEP(cep)) {
      throw new AppError('Invalid CEP');
    }

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

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

  async findById(id: string): Promise<IClientResponse> {
    if (!ObjectId.isValidObjectId(id)) {
      throw new AppError('Id entered is not valid');
    }
    const client = await ClientRepository.findById(id);

    if (client.length === 0) {
      throw new AppError('Client not found', 404, 'Not Found');
    }

    return {
      ...client[0],
      birthday: format(new Date(client[0].birthday), 'dd/MM/yyyy'),
      cep: formatCEP(client[0].cep),
      cpf: formatCPF(client[0].cpf),
    };
  }

  async update(
    id: string,
    { name, birthday, password, cep, number }: IClientUpdate,
  ): Promise<IClientResponse> {
    await this.findById(id);

    const client: any = {};
    if (name) {
      client.name = name;
    }
    if (birthday) {
      client.birthday = validateDate(birthday);
    }

    if (password) {
      client.password = await hash(password, 8);
    }

    if (cep) {
      if (!isValidCEP(cep)) {
        throw new AppError('Invalid CEP');
      }

      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

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
    if (!ObjectId.isValidObjectId(id)) {
      throw new AppError('Id entered is not valid');
    }
    const client = await ClientRepository.findById(id);

    if (client.length === 0) {
      throw new AppError('Client not found', 404, 'Not Found');
    }

    await ClientRepository.remove(id);
  }
}

export default new ClientService();
