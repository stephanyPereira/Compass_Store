import { Router } from 'express';
import SaleController from '../app/controller/SaleController';

import createValidation from '../app/validations/sale/create';

const router = Router();

router.post('/sale', createValidation, SaleController.create);
// router.get('/sale', SaleController.find);
router.get('/sale/:id', SaleController.findById);
// router.put('/sale/:id', SaleController.update);
// router.delete('/sale/:id', SaleController.delete);

export default router;
