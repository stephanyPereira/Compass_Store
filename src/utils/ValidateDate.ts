import { isAfter, isValid } from 'date-fns';
import AppError from '../errors/AppError';

export default function validateDate(birthday: string): Date {
  const day = birthday.split('/')[0];
  const month = birthday.split('/')[1];
  const year = birthday.split('/')[2];

  const date = new Date(
    `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(
      -2,
    )}T00:00:00.003-03:00`,
  );

  if (!isValid(date)) {
    throw new AppError('Invalid Date');
  }

  if (isAfter(date, Date.now())) {
    throw new AppError('The given date is in the future');
  }

  return date;
}
