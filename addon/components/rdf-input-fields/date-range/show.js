import SimpleInputFieldComponent from '../simple-value-input-field';
import rdflib from 'browser-rdflib';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';

import { SHACL } from '@lblod/submission-form-helpers';

const DATE_RANGE = new rdflib.Namespace(
  'http://data.lblod.info/form-fields/date-range/'
);

export default class FormInputFieldsDateRangeShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-range-' + guidFor(this);

  @tracked from;
  @tracked to;

  paths = {
    from: null,
    to: null,
  };

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const { store, formGraph, sourceGraph, sourceNode } = this.storeOptions;
    const field = this.args.field;

    this.paths = {
      from: store.any(
        store.any(field.uri, DATE_RANGE('from'), undefined, formGraph),
        SHACL('path'),
        undefined,
        formGraph
      ),
      to: store.any(
        store.any(field.uri, DATE_RANGE('to'), undefined, formGraph),
        SHACL('path'),
        undefined,
        formGraph
      ),
    };

    const from = store.any(sourceNode, this.paths.from, undefined, sourceGraph);
    const to = store.any(sourceNode, this.paths.to, undefined, sourceGraph);

    if (from && to) {
      this.from = from.value;
      this.to = to.value;
    }
  }

  get isEnabled() {
    return !!(this.from && this.to);
  }
}
