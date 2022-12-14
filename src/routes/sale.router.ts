import { Router } from 'express';
import SaleController from '../app/controller/SaleController';

import createValidation from '../app/validations/sale/create';
import updateValidation from '../app/validations/sale/update';
import findValidation from '../app/validations/sale/find';

const router = Router();

router.post('/sale', createValidation, SaleController.create);
router.get('/sale', findValidation, SaleController.find);
router.get('/sale/:id', SaleController.findById);
router.put('/sale/:id', updateValidation, SaleController.update);
router.delete('/sale/:id', SaleController.delete);

export default router;
