import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfInputFieldsCurrencyInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  currencySymbol = '€';
  thousandSeparator = ' ';
  decimalSeparator = ',';
  showSymbolAtStart = true;

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const inputAmount = e.target.value.trim();
    this.value = this.formatAmount(inputAmount);
    super.updateValue(this.value);
  }

  formatAmount(amount) {
    const beforeDecimalSeparator = this.getValueBeforeDecimalSeperator(amount);
    const afterDecimalSeparator = this.getValueAfterDecimalSeperator(amount);

    return (
      beforeDecimalSeparator + this.decimalSeparator + afterDecimalSeparator
    );
  }

  getValueBeforeDecimalSeperator(amount) {
    return amount.slice(0, amount.lastIndexOf(this.decimalSeparator));
  }
  getValueAfterDecimalSeperator(amount) {
    return amount.slice(
      amount.lastIndexOf(this.decimalSeparator) + 1,
      amount.length
    );
  }
}
