import { Router } from 'express';
import ProductController from '../app/controller/ProductController';

const router = Router();

router.post('/product', ProductController.create);
// router.get('/product', ProductController.find);
// router.get('/product/:id', ProductController.findById);
// router.put('/product/:id', ProductController.update);
// router.delete('/product/:id', ProductController.remove);

export default router;
