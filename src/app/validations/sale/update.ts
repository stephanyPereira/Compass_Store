import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      clientCurrency: Joi.string().trim().not().empty(),
      date: Joi.string()
        .trim()
        .not()
        .empty()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/),
      items: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().trim().not().empty().required(),
            qtd: Joi.number().not().empty().required(),
          }).min(1),
        )
        .min(1),
    }).min(1);

    const { error } = await schema.validate(req.body, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
