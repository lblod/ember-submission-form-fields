import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import Inputmask from 'inputmask';

export default class RdfInputFieldsCurrencyInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  currencyIsocode = 'EUR';
  decimalSeparator = ',';
  thousandSeparator = '.';

  @tracked inputElement;

  @action
  maskInput() {
    Inputmask({
      alias: 'numeric',
      radixPoint: this.decimalSeparator,
      groupSeparator: this.thousandSeparator,
      digits: 3,
      digitsOptional: false,
      prefix: '',
      placeholer: '0,00',
      oncomplete: (event) => {
        if (event.target && event.target.inputmask) {
          this.value = event.target.inputmask.unmaskedvalue();

          super.updateValue(this.value.replace(this.decimalSeparator, '.'));
        }
      },
    }).mask(this.element);
  }

  @action
  setInput(element) {
    this.element = element;
    this.maskInput();
  }

  numberStringToFormattedString(numberString) {
    const fromDecimalSeparator = '.';

    return `${numberString}`.replace(
      fromDecimalSeparator,
      this.decimalSeparator
    );
  }
}
