import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';

module('Integration | Helper | is-last', function (hooks) {
  setupRenderingTest(hooks);

  test('it can check if the provided item is the last item in the array', async function (assert) {
    this.array = [1, 2, 3, 4];
    this.value = 4;
    this.isLast = isLast;

    await render(hbs`{{this.isLast this.array this.value}}`);
    assert.dom().hasText('true');

    this.set('value', 2);
    assert.dom().hasText('false');

    this.set('array', [{ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' }]);
    this.set('value', this.array.at(-1));
    assert.dom().hasText('true', 'it works with object references');

    this.set('array', []);
    assert.dom().hasText('false', 'it returns `false` if the array is empty');

    this.set('array', 'not an array');
    assert
      .dom()
      .hasText(
        'false',
        'it returns `false` if the first argument is not an array'
      );
  });
});
