import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { stringAmountToNumber } from '../../utils/string-amount-to-number';

export default class RdfInputFieldsCurrencyInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  currencyIsocode = 'EUR';
  decimalSeparator = ',';
  thousandSeparator = '.';

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (e.target && e.target.value) {
      this.value = e.target.inputmask.unmaskedvalue();

      super.updateValue(this.value);
    }
  }

  numberStringToFormattedString(numberString) {
    const fromDecimalSeparator = '.';

    return `${numberString}`.replace(
      fromDecimalSeparator,
      this.decimalSeparator
    );
  }

  get formattedValue() {
    return this.numberStringToFormattedString(this.value);
  }
}
