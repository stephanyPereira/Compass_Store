import axios from 'axios';
import { ICEP } from '../interfaces/ICEP';

class CEPRepository {
  async find(cep: string): Promise<ICEP> {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    return data;
  }
}

export default new CEPRepository();
