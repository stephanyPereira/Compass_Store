import axios from 'axios';
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
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    const result = await ClientRepository.create({
      name,
      cpf,
      birthday,
      email,
      password,
      cep,
      uf: data.uf,
      city: data.localidade,
      address: data.logradouro,
      number,
      complement: data.complemento,
      neighborhood: data.bairro,
    });

    return result;
  }
}

export default new ClientService();
