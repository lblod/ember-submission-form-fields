import {guidFor} from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import {computed} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import rdflib from "browser-rdflib";

import {SHACL} from '@lblod/submission-form-helpers';

const BASE = 'http://data.lblod.info/form-fields/date-range/';
const PREFIX = new rdflib.Namespace(BASE);


export default class FormInputFieldsDateRangeShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-range-' + guidFor(this);

  @tracked from;
  @tracked to;

  paths = {
    from: null,
    to: null
  }

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const {store, formGraph, sourceGraph, sourceNode} = this.storeOptions;
    const field = this.args.field;

    this.paths = {
      from: store.any(store.any(field.uri, PREFIX('from'), undefined, formGraph), SHACL('path'), undefined, formGraph),
      to: store.any(store.any(field.uri, PREFIX('to'), undefined, formGraph), SHACL('path'), undefined, formGraph),
    }

    const from = store.any(sourceNode, this.paths.from, undefined, sourceGraph);
    const to = store.any(sourceNode, this.paths.to, undefined, sourceGraph);

    if (from && to) {
      this.from = from.value;
      this.to = to.value;
    }
  }

  @computed('from', 'to')
  get isEnabled() {
    return !!(this.from && this.to);
  }
}
