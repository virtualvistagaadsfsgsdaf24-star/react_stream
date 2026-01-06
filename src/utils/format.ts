import dayjs from 'dayjs';
import 'dayjs/locale/id';

export const formatCurrency = (amount: number, currency: 'IDR' | 'USD' = 'IDR'): string => {
  return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, format: string = 'DD MMM YYYY', locale: string = 'id'): string => {
  return dayjs(date).locale(locale).format(format);
};