import SaleService from '../service/SaleService';

class SaleController {
  async create(req, res) {
    const result = await SaleService.create(req.body);

    return res.status(201).json(result);
  }
  // async find(req, res) {}

  async findById(req, res) {
    const { id } = req.params;

    const result = await SaleService.findById(id);

    return res.status(200).json(result);
  }

  async update(req, res) {
    const { id } = req.params;

    const result = await SaleService.update(id, req.body);

    return res.status(200).json(result);
  }
  // async delete(req, res) {}
}

export default new SaleController();
