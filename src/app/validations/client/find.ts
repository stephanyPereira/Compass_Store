import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().not().empty(),
      cpf: Joi.string().trim().not().empty(),
      birthday: Joi.string().trim().not().empty(),
      email: Joi.string().trim().not().empty(),
      cep: Joi.string().trim().not().empty(),
      uf: Joi.string().trim().not().empty(),
      city: Joi.string().trim().not().empty(),
      address: Joi.string().trim().not().empty(),
      number: Joi.number().not().empty(),
      complement: Joi.string().trim().not().empty(),
      neighborhood: Joi.string().trim().not().empty(),
      page: Joi.number().not().empty(),
      size: Joi.number().not().empty(),
    });

    const { error } = await schema.validate(req.query, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
