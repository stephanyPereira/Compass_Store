import {
  formatCEP,
  formatCPF,
  isValidCEP,
  isValidCPF,
} from '@brazilian-utils/brazilian-utils';
import ObjectId from 'mongoose';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { format, isAfter, isValid } from 'date-fns';

import AppError from '../../errors/AppError';
import { IClientBody, IClientResponse } from '../interfaces/IClient';
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

    const day = birthday.split('/')[0];
    const month = birthday.split('/')[1];
    const year = birthday.split('/')[2];

    const date = new Date(
      `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(
        -2,
      )}T00:00:00.003-03:00`,
    );

    if (!isValid(date)) {
      throw new AppError('Invalid Date');
    }

    if (isAfter(date, Date.now())) {
      throw new AppError('The given date is in the future');
    }

    if (!isValidCEP(cep)) {
      throw new AppError('Invalid CEP');
    }

    const passwordHash = await hash(password, 8);

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
