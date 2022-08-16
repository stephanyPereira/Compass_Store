import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      name: Joi.string().trim().not().empty(),
      category: Joi.string().trim().not().empty(),
      currency: Joi.string().trim().not().empty(),
      price: Joi.number().greater(0).not().empty(),
    }).min(1);

    const { error } = await schema.validate(req.body, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
