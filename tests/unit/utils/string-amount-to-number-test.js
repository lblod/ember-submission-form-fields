import { module, test } from 'qunit';
import { stringAmountToNumber } from '@lblod/ember-submission-form-fields/utils/string-amount-to-number';

module('Unit | Utility | string amount to number', function () {
  test('string to number without value for decimals', function (assert) {
    const decimalSeparator = ',';
    const thousandSeparator = '.';
    const stringAmount = '999';

    assert.deepEqual(
      stringAmountToNumber(stringAmount, {
        decimalSeparator,
        thousandSeparator,
      }),
      999
    );
  });
  test('string to number with value  for decimals', function (assert) {
    const decimalSeparator = ',';
    const thousandSeparator = '.';
    const stringAmount = '999,99';

    assert.deepEqual(
      stringAmountToNumber(stringAmount, {
        decimalSeparator,
        thousandSeparator,
      }),
      999.99
    );
  });
  test('string to number with thousands value and no decimals', function (assert) {
    const decimalSeparator = ',';
    const thousandSeparator = '.';
    const stringAmount = '999.999';

    assert.deepEqual(
      stringAmountToNumber(stringAmount, {
        decimalSeparator,
        thousandSeparator,
      }),
      999999
    );
  });
  test('string to number with thousands value and value for decimals', function (assert) {
    const decimalSeparator = ',';
    const thousandSeparator = '.';
    const stringAmount = '999.999,99';

    assert.deepEqual(
      stringAmountToNumber(stringAmount, {
        decimalSeparator,
        thousandSeparator,
      }),
      999999.99
    );
  });
  test('string number to number', function (assert) {
    const decimalSeparator = '.';
    const thousandSeparator = ' ';
    const stringAmountAsNumber = '999999.99';

    assert.deepEqual(
      stringAmountToNumber(stringAmountAsNumber, {
        decimalSeparator,
        thousandSeparator,
      }),
      999999.99
    );
  });
});
