import { Router } from 'express';
import ClientController from '../app/controller/ClientController';
import createValidation from '../app/validations/client/create';

const router = Router();

router.post('/client', createValidation, ClientController.create);
router.get('/client/:id', ClientController.findById);
router.delete('/client/:id', ClientController.remove);

export default router;
