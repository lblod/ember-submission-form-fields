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
    const number = rdflib.literal(this.value, this.datatype);
    super.updateValue(number);
  }

  get datatype() {
    const number = parseFloat(this.value);
    if(!isNaN(number)) {
      if (Number.isInteger(number)) {
        return XSD('integer');
      }
      return XSD('decimal');
    }
    // NOTE shouldn't be able to reach this point
    return XSD('string');
  }
}
