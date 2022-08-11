import {
  formatCEP,
  formatCPF,
  isValidCEP,
  isValidCPF,
} from '@brazilian-utils/brazilian-utils';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { isAfter, isValid } from 'date-fns';

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
      `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`,
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

    const result = await ClientRepository.create({
      name,
      cpf: cpfFormat,
      birthday,
      email,
      password: passwordHash,
      cep,
      uf: data.uf,
      city: data.localidade,
      address: data.logradouro,
      number,
      complement: data.complemento,
      neighborhood: data.bairro,
    });

    return {
      _id: result._id,
      name: result.name,
      cpf: formatCPF(result.cpf),
      birthday: result.birthday,
      email: result.email,
      cep: formatCEP(result.cep),
      uf: result.uf,
      city: result.city,
      address: result.address,
      number: result.number,
      complement: result.complement,
      neighborhood: result.neighborhood,
    };
  }
}

export default new ClientService();
