import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      client: Joi.string().trim().not().empty(),
      clientCurrency: Joi.string().trim().not().empty(),
      product: Joi.string().trim().not().empty(),
      date: Joi.string().trim().not().empty(),
      minTotal: Joi.number().not().empty(),
      maxTotal: Joi.number().not().empty(),
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
