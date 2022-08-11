import { Router } from 'express';
import ClientController from '../app/controller/ClientController';
import createValidation from '../app/validations/client/create';

const router = Router();

router.post('/client', createValidation, ClientController.create);

export default router;
