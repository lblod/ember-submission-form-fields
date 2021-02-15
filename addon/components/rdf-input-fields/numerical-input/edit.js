import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import rdflib from 'browser-rdflib';
import { XSD } from '@lblod/submission-form-helpers';

export default class RdfInputFieldsNumericalInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e) {
    e.preventDefault();
    const number = rdflib.literal(Number(this.value), this.datatype);
    super.updateValue(number);
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
