import { helper } from '@ember/component/helper';

export default helper(function convertToCurrency(number) {
  const formatter = new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR'
  });
  return formatter.format(number);
});
