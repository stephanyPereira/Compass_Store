import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().not().empty().required(),
      cpf: Joi.string()
        .trim()
        .not()
        .empty()
        .regex(/[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}/)
        .required(),
      birthday: Joi.string()
        .trim()
        .not()
        .empty()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)
        .required(),
      email: Joi.string().trim().not().empty().email().required(),
      password: Joi.string().trim().min(6).required(),
      cep: Joi.string().trim().not().empty().required(),
      number: Joi.number().not().empty().required(),
    });

    const { error } = await schema.validate(req.body, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
