import ProductService from '../service/ProductService';

class ProductController {
  async create(req, res) {
    const result = await ProductService.create(req.body);

    return res.status(201).json(result);
  }

  // async find(req, res) {}

  async findById(req, res) {
    const { id } = req.params;

    const result = await ProductService.findById(id);

    return res.status(200).json(result);
  }

  // async update(req, res) {}

  // async remove(req, res) {}
}

export default new ProductController();
