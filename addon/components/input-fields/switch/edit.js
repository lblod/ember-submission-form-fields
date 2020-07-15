import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';

import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsSwitchEditComponent extends SimpleInputFieldComponent {
  inputId = 'switch-' + guidFor(this);

  @tracked checked = false;

  @action
  updateValue(e) {
    this.value = e.target.checked;
    super.updateValue(this.value);
  }
}