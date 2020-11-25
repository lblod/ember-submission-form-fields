import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class RdfInputFieldsNumericalInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e) {
    e.preventDefault();
    const numericalValue = parseInt(this.value);
    numericalValue ? super.updateValue(numericalValue) : super.updateValue(this.value && this.value.trim());
  }
}
