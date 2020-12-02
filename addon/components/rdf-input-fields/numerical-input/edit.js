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
    // TODO for now decimals are not supported
    const number = Number(this.value);
    if (Number.isInteger(number) && number <= Number.MAX_SAFE_INTEGER) {
      return XSD('integer');
    }
    // NOTE: to not make queries fail, everything that is not a integer is seen as string.
    return XSD('string');
  }
}
