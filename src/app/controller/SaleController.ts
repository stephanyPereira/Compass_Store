import { Request, Response } from 'express';
import { ISaleFilters } from '../interfaces/ISale';
import SaleService from '../service/SaleService';

class SaleController {
  async create(req: Request, res: Response) {
    const result = await SaleService.create(req.body);

    return res.status(201).json(result);
  }
  async find(req: Request, res: Response) {
    const result = await SaleService.find(req.query as ISaleFilters);

    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const result = await SaleService.findById(id);

    return res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const result = await SaleService.update(id, req.body);

    return res.status(200).json(result);
  }
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const result = await SaleService.remove(id);

    return res.status(204).json(result);
  }
}

export default new SaleController();
