import ProductService from '../service/ProductService';

class ProductController {
  async create(req, res) {
    const result = await ProductService.create(req.body);

    return res.status(201).json(result);
  }

  // async find(req, res) {}

  // async findById(req, res) {}

  // async update(req, res) {}

  // async remove(req, res) {}
}

export default new ProductController();
