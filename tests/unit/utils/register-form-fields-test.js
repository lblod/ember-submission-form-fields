import { setComponentTemplate } from '@ember/component';
import templateOnlyComponent from '@ember/component/template-only';
import { registerFormFields } from '@lblod/ember-submission-form-fields';
import {
  getComponentForDisplayType,
  registerComponentsForDisplayType,
  resetCustomComponentRegistrations,
} from '@lblod/ember-submission-form-fields/utils/display-type';
import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';

module('Unit | Utility | registerFormFields', function (hooks) {
  hooks.beforeEach(function () {
    resetCustomComponentRegistrations();
  });

  let EditComponent = setComponentTemplate(hbs`edit`, templateOnlyComponent());
  let ShowComponent = setComponentTemplate(hbs`show`, templateOnlyComponent());

  test("it's possible to register new form field components", function (assert) {
    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: EditComponent,
        show: ShowComponent,
      },
    ]);

    let FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
    );
    assert.strictEqual(EditComponent, FieldComponent);

    FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
      true,
    );
    assert.strictEqual(ShowComponent, FieldComponent);
  });

  test('it uses the edit component as a fallback for the show component', function (assert) {
    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: EditComponent,
      },
    ]);

    let FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
    );
    assert.strictEqual(EditComponent, FieldComponent);

    FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
      true,
    );
    assert.strictEqual(EditComponent, FieldComponent);
  });

  test('it can override previously registered components for a certain display type', function (assert) {
    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: EditComponent,
        show: ShowComponent,
      },
    ]);

    let ComponentOverride = setComponentTemplate(
      hbs`override`,
      templateOnlyComponent(),
    );
    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: ComponentOverride,
      },
    ]);

    let FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
    );
    assert.strictEqual(
      ComponentOverride,
      FieldComponent,
      'it returns the new edit component',
    );

    FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
      true,
    );
    assert.strictEqual(
      ShowComponent,
      FieldComponent,
      'it returns the previous show component',
    );

    registerFormFields([
      {
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: ComponentOverride,
        show: ComponentOverride,
      },
    ]);

    FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
    );
    assert.strictEqual(
      ComponentOverride,
      FieldComponent,
      'it returns the new edit component',
    );

    FieldComponent = getComponentForDisplayType(
      'http://lblod.data.gift/display-types/hello',
      true,
    );
    assert.strictEqual(
      ComponentOverride,
      FieldComponent,
      'it returns the new show component',
    );
  });

  test('it throws an error if no array is provided', function (assert) {
    assert.throws(() => {
      registerFormFields({
        displayType: 'http://lblod.data.gift/display-types/hello',
        edit: EditComponent,
      });
    }, /The form fields should be provided as an array/);
  });

  test('it throws an error if no display type is provided', function (assert) {
    assert.throws(() => {
      registerFormFields([
        {
          edit: EditComponent,
        },
      ]);
    }, /`displayType` is required when registering a form field/);
  });

  test('it throws an error when trying to override a built-in display type', function (assert) {
    registerComponentsForDisplayType([
      {
        displayType: 'http://lblod.data.gift/display-types/built-in',
        edit: EditComponent,
      },
    ]);

    let ComponentOverride = setComponentTemplate(
      hbs`override`,
      templateOnlyComponent(),
    );

    assert.throws(() => {
      registerFormFields([
        {
          displayType: 'http://lblod.data.gift/display-types/built-in',
          edit: ComponentOverride,
        },
      ]);
    }, /Registering a component for the 'http:\/\/lblod\.data\.gift\/display-types\/built-in' display type isn't allowed since a built-in component already handles it./);
  });

  test('it throws an error if no edit component is provided', function (assert) {
    assert.throws(() => {
      registerFormFields([
        {
          displayType: 'http://lblod.data.gift/display-types/hello',
          show: ShowComponent,
        },
      ]);
    }, /The edit component is required when registering custom fields/);
  });
});
