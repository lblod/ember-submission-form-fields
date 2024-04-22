import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { XSD } from '@lblod/submission-form-helpers';
import { Literal, literal } from 'rdflib';
import { hasValidFieldOptions } from '@lblod/ember-submission-form-fields/utils/has-valid-field-options';
import { FORM_OPTION } from '@lblod/ember-submission-form-fields/utils/namespaces';

export default class RdfInputFieldsNumericalInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @tracked allowClear;

  constructor() {
    super(...arguments);

    this.loadOptions();
  }

  loadOptions() {
    let allowClear = this.args.formStore.any(
      this.args.field.uri,
      FORM_OPTION('allowClear'),
      undefined,
      this.args.graphs.formGraph
    );
    if (!allowClear) {
      if (!hasValidFieldOptions(this.args.field, ['allowClear'])) {
        this.allowClear = false;
      }
      this.allowClear = this.args.field.options.allowClear;
    } else {
      this.allowClear = Literal.toJS(allowClear);
    }
  }

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    this.value = e.target.value;
    if (!this.value && this.allowClear) {
      this.value = null;
      super.updateValue(null);
    } else {
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
