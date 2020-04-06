export default function singleInstanceTaxRateOrExtraTaxRate(values) {
  if(values.length && values.length > 1) return false;
  return true;
}
