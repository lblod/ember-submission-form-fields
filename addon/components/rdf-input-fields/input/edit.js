import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e, hasBeenFocused=true) {
    if (e && typeof e.preventDefault === "function")
      e.preventDefault();
    super.updateValue(this.value && this.value.trim(), hasBeenFocused);
  }
}
