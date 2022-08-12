import { Router } from 'express';
import ClientController from '../app/controller/ClientController';
import createValidation from '../app/validations/client/create';
import updateValidation from '../app/validations/client/update';

const router = Router();

router.post('/client', createValidation, ClientController.create);
router.get('/client/:id', ClientController.findById);
router.put('/client/:id', updateValidation, ClientController.update);
router.delete('/client/:id', ClientController.remove);

export default router;
