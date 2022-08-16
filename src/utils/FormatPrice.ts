export default function FormatPrice(price: number, currency: string): string {
  let localCode: string;
  switch (currency) {
    case 'USD':
      localCode = 'en-US';
      break;
    case 'BRL':
      localCode = 'pt-BR';
      break;
    default:
      localCode = 'en-US';
  }
  const formatter = new Intl.NumberFormat(localCode, {
    style: 'currency',
    currency,
  });

  return formatter.format(price);
}
