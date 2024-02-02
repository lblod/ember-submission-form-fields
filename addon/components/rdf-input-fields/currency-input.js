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
    const workAmount = amount;
    const beforeDecimalSeparator =
      this.getValueBeforeDecimalSeperator(workAmount);
    console.log({ beforeDecimalSeparator });
    const afterDecimalSeparator =
      this.getValueAfterDecimalSeperator(workAmount);
    console.log({ afterDecimalSeparator });

    return (
      this.formatValueBeforeDecimalSeparator(beforeDecimalSeparator) +
      this.decimalSeparator +
      afterDecimalSeparator
    );
  }

  getValueBeforeDecimalSeperator(amount) {
    const lastIndex = amount.lastIndexOf(this.decimalSeparator);

    return lastIndex == -1 ? amount : amount.slice(0, lastIndex);
  }
  getValueAfterDecimalSeperator(amount) {
    const lastIndex = amount.lastIndexOf(this.decimalSeparator);

    return lastIndex == -1 ? '00' : amount.slice(lastIndex + 1, amount.length);
  }

  formatValueBeforeDecimalSeparator(amount) {
    amount.replace(this.thousandSeparator, '');

    if (amount.length > 3) {
      amount = this.replaceEveryXCharacterWith(amount);
    }

    return amount;
  }

  replaceEveryXCharacterWith(amount) {
    const everyXChar = 3;
    const resultArray = [];

    for (
      let i = 0, stringLength = amount.length;
      i < stringLength;
      i -= everyXChar
    ) {
      resultArray.push(amount.substr(i, everyXChar));
    }

    return resultArray.join(this.thousandSeparator);
  }
}
