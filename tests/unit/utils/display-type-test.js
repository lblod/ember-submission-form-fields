import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';
import {
  getComponentForDisplayType,
  registerComponentsForDisplayType,
  resetBuiltInComponentRegistrations,
  resetCustomComponentRegistrations,
} from '@lblod/ember-submission-form-fields/utils/display-type';
import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';

module('Unit | Utility | display-type', function () {
  module('getComponentForDisplayType', function (hooks) {
    hooks.beforeEach(function () {
      resetBuiltInComponentRegistrations();
      resetCustomComponentRegistrations();
    });

    const TEST_DISPLAY_TYPE = 'http://lblod.data.gift/display-types/hello';

    let EditComponent = setComponentTemplate(
      hbs`edit`,
      templateOnlyComponent()
    );
    let ShowComponent = setComponentTemplate(
      hbs`show`,
      templateOnlyComponent()
    );

    test('it returns a component for a given display type URI', function (assert) {
      registerComponentsForDisplayType([
        {
          displayType: TEST_DISPLAY_TYPE,
          edit: EditComponent,
          show: ShowComponent,
        },
      ]);

      let FieldComponent = getComponentForDisplayType(TEST_DISPLAY_TYPE);
      assert.strictEqual(
        FieldComponent,
        EditComponent,
        'it returns the edit component'
      );

      FieldComponent = getComponentForDisplayType(
        TEST_DISPLAY_TYPE,
        true,
        'it returns the show component'
      );
      assert.strictEqual(FieldComponent, ShowComponent);
    });

    test('it throws an error if a display type has no corresponding component', function (assert) {
      assert.expect(1);
      assert.throws(() => {
        let FieldComponent = getComponentForDisplayType(
          'http://lblod.data.gift/display-types/not-registered'
        );

        assert.notOk(FieldComponent, 'no component class was returned');
      }, 'it throws an error');
    });
  });
});
