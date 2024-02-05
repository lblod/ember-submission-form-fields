export function stringAmountToNumber(
  stringAmount,
  { decimalSeparator, thousandSeparator }
) {
  let workString = stringAmount.trim();
  const withThousandSeparatorAsSpace = workString.replaceAll(
    thousandSeparator,
    ''
  );
  const withDecimalSeparatorAsDot = withThousandSeparatorAsSpace.replaceAll(
    decimalSeparator,
    '.'
  );

  return Number(withDecimalSeparatorAsDot);
}
