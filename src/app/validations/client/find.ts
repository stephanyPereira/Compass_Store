import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      cpf: Joi.string(),
      birthday: Joi.string(),
      email: Joi.string(),
      cep: Joi.string(),
      uf: Joi.string(),
      city: Joi.string(),
      address: Joi.string(),
      number: Joi.number(),
      complement: Joi.string().empty(true),
      neighborhood: Joi.string(),
      page: Joi.number(),
      size: Joi.number(),
    });

    const { error } = await schema.validate(req.query, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
