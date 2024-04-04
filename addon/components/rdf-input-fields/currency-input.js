import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfInputFieldsCurrencyInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  currencyIsocode = 'EUR';

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (e.target && e.target.value) {
      this.value = e.target.inputmask.unmaskedvalue();
    } else {
      this.value = null;
    }
    super.updateValue(this.value);
  }
}
