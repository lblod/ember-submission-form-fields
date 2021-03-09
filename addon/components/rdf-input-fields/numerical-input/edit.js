import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import rdflib from 'browser-rdflib';
import { XSD, FORM, SHACL } from '@lblod/submission-form-helpers';
import { next } from '@ember/runloop';

export default class RdfInputFieldsNumericalInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  constructor() {
    super(...arguments);

    if (!this.value) {
      this.setDefaultValue();
      next(this, () => {
        if (this.value) {
          this.updateFieldValue();
        }
      });
    }
  }

  @action
  updateValue(e) {
    e.preventDefault();
    this.updateFieldValue();
  }

  updateFieldValue() {
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

  /**
   * Sets a default value on the field if the property `form:defaultValue` is defined in the
   * field's configuration
   */
  setDefaultValue() {
    const field = this.storeOptions.store.match(
      undefined,
      SHACL('path'),
      this.storeOptions.path,
      this.storeOptions.formGraph)[0].subject;

    const defaultValueTriple = this.storeOptions.store.match(
      field,
      FORM('defaultValue'),
      undefined,
      this.storeOptions.formGraph)[0];

    if (defaultValueTriple) this.value = defaultValueTriple.object.value;
  }
}
