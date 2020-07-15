import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import rdflib from 'browser-rdflib';

import { SHACL } from '@lblod/submission-form-helpers';

const BASE = 'http://data.lblod.info/form-fields/date-range/';
const PREFIX = new rdflib.Namespace(BASE);

export default class FormInputFieldsDateRangeEditComponent extends SimpleInputFieldComponent {
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
    const {store, formGraph, sourceGraph, sourceNode} = this.storeOptions;
    const field = this.args.field;

    this.paths = {
      from: store.any(store.any(field.uri, PREFIX('from'), undefined, formGraph), SHACL('path'), undefined, formGraph),
      to: store.any(store.any(field.uri, PREFIX('to'), undefined, formGraph), SHACL('path'), undefined, formGraph),
    };

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

  @action
  reset() {
    this.delete(this.paths.from);
    this.delete(this.paths.to);

    this.from = null;
    this.to = null;

    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }

  @action
  enable() {
    const yesterday = moment().subtract(1, 'day').startOf('day');
    const today = moment().endOf('day');

    this.update(yesterday.toDate(), this.paths.from);
    this.update(today.toDate(), this.paths.to);

    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }

  delete(prefix) {
    const triples = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      prefix,
      undefined,
      this.storeOptions.sourceGraph);
    this.storeOptions.store.removeStatements(triples);
  }

  update(date, prefix) {
    this.delete(prefix);

    // In with the new
    const triples = [
      {
        subject: this.storeOptions.sourceNode,
        predicate: prefix,
        object: date.toISOString(),
        graph: this.storeOptions.sourceGraph,
      }];
    this.storeOptions.store.addAll(triples);
  }

  @action
  updateFrom(date) {
    this.update(date, this.paths.from);

    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }

  @action
  updateTo(date) {
    this.update(date, this.paths.to);

    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }
}
