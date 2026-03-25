import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { SHACL } from '@lblod/submission-form-helpers';
import { Namespace } from 'rdflib';

const DATE_RANGE = new Namespace(
  'http://data.lblod.info/form-fields/date-range/',
);

export default class RdfInputFieldsDateRangeComponent extends SimpleInputFieldComponent {
  inputId = 'date-range-from' + guidFor(this);
  inputIdTo = `date-range-to-${guidFor(this)}`;
  HelpText = HelpText;

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
        formGraph,
      ),
      to: store.any(
        store.any(field.uri, DATE_RANGE('to'), undefined, formGraph),
        SHACL('path'),
        undefined,
        formGraph,
      ),
    };

    const from = store.any(sourceNode, this.paths.from, undefined, sourceGraph);
    const to = store.any(sourceNode, this.paths.to, undefined, sourceGraph);

    if (from && to) {
      this.from = new Date(from.value);
      this.to = new Date(to.value);
    }
  }

  // NOTE overrides because this is a special custom component
  willDestroy() {
    if (!this.args.cacheConditionals) {
      this.delete(this.paths.from);
      this.delete(this.paths.to);
    }
  }

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
    const today = new Date();
    today.setHours(23, 59, 59, 59);

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    this.update(yesterday, this.paths.from);
    this.update(today, this.paths.to);

    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }

  delete(predicate) {
    const triples = this.storeOptions.store.match(
      this.storeOptions.sourceNode,
      predicate,
      undefined,
      this.storeOptions.sourceGraph,
    );
    this.storeOptions.store.removeStatements(triples);
  }

  update(date, predicate) {
    this.delete(predicate);

    // In with the new
    const triples = [
      {
        subject: this.storeOptions.sourceNode,
        predicate: predicate,
        object: date.toISOString(),
        graph: this.storeOptions.sourceGraph,
      },
    ];
    this.storeOptions.store.addAll(triples);
  }

  @action
  updateFrom(isoDate, date) {
    if (date) {
      this.update(date, this.paths.from);
    }
    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }

  @action
  updateTo(isoDate, date) {
    if (date) {
      this.update(date, this.paths.to);
    }
    this.hasBeenFocused = true;
    this.loadProvidedValue();
  }
}
