import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { XSD } from '@lblod/submission-form-helpers';
import { literal } from 'rdflib';

export default class RdfInputFieldsNumericalInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const value = e.target.value;
    if (!value) {
      this.value = null;
      super.updateValue(null);
    } else {
      this.value = value;
      const number = literal(Number(this.value), this.datatype);
      super.updateValue(number);
    }
  }

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
