import { Router } from 'express';
import ProductController from '../app/controller/ProductController';

import createValidation from '../app/validations/product/create';
import findValidation from '../app/validations/product/find';

const router = Router();

router.post('/product', createValidation, ProductController.create);
router.get('/product', findValidation, ProductController.find);
router.get('/product/:id', ProductController.findById);
// router.put('/product/:id', ProductController.update);
// router.delete('/product/:id', ProductController.remove);

export default router;
