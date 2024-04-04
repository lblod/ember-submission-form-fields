import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { XSD } from '@lblod/submission-form-helpers';
import { literal } from 'rdflib';

export default class RdfInputFieldsCurrencyInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  currencyIsocode = 'EUR';

  @action
  updateValue(e) {
    let updatedValue = null;
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    if (e.target && e.target.value) {
      this.value = e.target.inputmask.unmaskedvalue();
      updatedValue = literal(Number(this.value), this.datatype);
    }

    super.updateValue(updatedValue);
  }

  // Took this over from numerical-input.js
  // When value 0 is filled it will be recognized as a deciaml or intiger
  // instead of an invalid value
  get datatype() {
    const number = Number(this.value);
    if (!Number.isNaN(number) && Number.isFinite(number)) {
      let datatype = XSD('decimal');
      if (Number.isInteger(number) && Number.isSafeInteger(number)) {
        datatype = XSD('integer');
      }
      return datatype;
    }
    // NOTE: everything that is not a number is a string.
    return XSD('string');
  }
}
