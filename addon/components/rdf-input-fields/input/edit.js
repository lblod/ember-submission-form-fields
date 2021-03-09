import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { next } from '@ember/runloop';

export default class FormInputFieldsInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  constructor() {
    super(...arguments);

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
      next(this, () => {
        this.updateFieldValue();
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
}
