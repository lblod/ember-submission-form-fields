import { module, test } from 'qunit';

import { valueToType } from '@lblod/ember-submission-form-fields/utils/value-to-type';

module('Unit | Utility | value to type', function () {
  test('Can proccess a value of type function to the possible returntypes', function (assert) {
    const countOneAndOne = () => {
      return 1 + 1;
    };

    const valueAsString = valueToType(countOneAndOne, 'string');
    const valueAsBoolean = valueToType(countOneAndOne, 'boolean');

    assert.deepEqual(typeof countOneAndOne, 'function');
    assert.deepEqual(typeof valueAsString, 'string');
    assert.deepEqual(typeof valueAsBoolean, 'boolean');
    assert.false(valueAsBoolean);
  });
  test('Can proccess a value of type object to the possible returntypes', function (assert) {
    const myObject = {
      property: 'value',
    };

    const valueAsString = valueToType(myObject, 'string');
    const valueAsBoolean = valueToType(myObject, 'boolean');

    assert.deepEqual(typeof myObject, 'object');
    assert.deepEqual(typeof valueAsString, 'string');
    assert.deepEqual(typeof valueAsBoolean, 'boolean');
    assert.false(valueAsBoolean);
  });
  test('Can proccess a value of type string to the possible returntypes', function (assert) {
    const myString = 'qunit';

    const valueAsString = valueToType(myString, 'string');
    const valueAsBoolean = valueToType(myString, 'boolean');

    assert.deepEqual(typeof myString, 'string');
    assert.deepEqual(typeof valueAsString, 'string');
    assert.deepEqual(valueAsString, myString);
    assert.deepEqual(typeof valueAsBoolean, 'boolean');
    assert.false(valueAsBoolean);
  });
  test('Can proccess a value of type boolean to the possible returntypes', function (assert) {
    const myBooleanTrue = true;

    const valueAsString = valueToType(myBooleanTrue, 'string');
    const valueAsBoolean = valueToType(myBooleanTrue, 'boolean');

    assert.deepEqual(typeof myBooleanTrue, 'boolean');
    assert.deepEqual(typeof valueAsString, 'string');
    assert.deepEqual(valueAsString, `${myBooleanTrue}`);
    assert.deepEqual(typeof valueAsBoolean, 'boolean');
    assert.deepEqual(valueAsBoolean, myBooleanTrue);
    assert.true(valueAsBoolean);
  });
  test('When string value ois zero or one it can be converte to a boolean true/false', function (assert) {
    const stringZero = '0';
    const stringOne = '1';

    const zeroToFalse = valueToType(stringZero, 'boolean');
    const oneToTrue = valueToType(stringOne, 'boolean');

    assert.deepEqual(typeof stringZero, 'string');
    assert.deepEqual(typeof stringOne, 'string');

    assert.deepEqual(typeof zeroToFalse, 'boolean');
    assert.deepEqual(typeof oneToTrue, 'boolean');
    assert.false(zeroToFalse);
    assert.true(oneToTrue);
  });
});
