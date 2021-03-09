import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { FORM, SHACL } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

export default class FormInputFieldsInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  constructor() {
    super(...arguments);

    if (!this.value) {
      this.setDefaultValue();
      next(this, () => {
        if (this.value) {
          this.updateFieldValue();
        }
      });
    }
  }

  @action
  updateValue(e) {
    e.preventDefault();
    this.updateFieldValue();
  }

  updateFieldValue() {
    super.updateValue(this.value && this.value.trim());
  }

  /**
   * Sets a default value on the field if the property `form:defaultValue` is defined in the
   * field's configuration
   */
  setDefaultValue() {
    const field = this.storeOptions.store.match(
      undefined,
      SHACL('path'),
      this.storeOptions.path,
      this.storeOptions.formGraph)[0].subject;

    const defaultValueTriple = this.storeOptions.store.match(
      field,
      FORM('defaultValue'),
      undefined,
      this.storeOptions.formGraph)[0];

    if (defaultValueTriple) this.value = defaultValueTriple.object.value;
  }
}
