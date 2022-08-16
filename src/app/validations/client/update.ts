import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().not().empty(),
      birthday: Joi.string()
        .trim()
        .not()
        .empty()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
      password: Joi.string().trim().min(6),
      cep: Joi.string().trim().not().empty(),
      number: Joi.number().not().empty(),
    }).min(1);

    const { error } = await schema.validate(req.body, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
