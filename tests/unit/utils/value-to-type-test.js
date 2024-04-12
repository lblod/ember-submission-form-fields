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
});
