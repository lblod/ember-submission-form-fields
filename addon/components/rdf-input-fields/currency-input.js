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
      const amount = stringAmountToNumber(e.target.value, {
        decimalSeparator: this.decimalSeparator,
        thousandSeparator: this.thousandSeparator,
      });
      this.value = this.numberStringToFormattedString(amount);

      super.updateValue(amount);
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
