import { Request, Response } from 'express';
import { IProductFilters } from '../interfaces/IProduct';
import ProductService from '../service/ProductService';

class ProductController {
  async create(req: Request, res: Response) {
    const result = await ProductService.create(req.body);

    return res.status(201).json(result);
  }

  async find(req: Request, res: Response) {
    const result = await ProductService.find(req.query as IProductFilters);

    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ProductService.findById(id);

    return res.status(200).json(result);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const result = await ProductService.update(id, req.body);

    return res.status(200).json(result);
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    await ProductService.remove(id);

    return res.status(204).send();
  }
}

export default new ProductController();
