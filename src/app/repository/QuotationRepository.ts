import axios from 'axios';

class QuotationRepository {
  async find(clientCurrency: string): Promise<number> {
    const { data } = await axios.get(
      `https://economia.awesomeapi.com.br/USD-${clientCurrency}/1`,
    );

    return data[0].ask;
  }
}

export default new QuotationRepository();
