import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../../../errors/AppError';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const schema = Joi.object({
      client: Joi.string().required(),
      clientCurrency: Joi.string(),
      date: Joi.string()
        .regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)
        .required(),
      items: Joi.array()
        .items(
          Joi.object({
            product: Joi.string().required(),
            qtd: Joi.number().required(),
          }).min(1),
        )
        .required()
        .min(1),
    });

    const { error } = await schema.validate(req.body, { abortEarly: true });
    if (error) throw error;
    return next();
  } catch (error) {
    throw new AppError(error.details[0].message);
  }
};
