import {guidFor} from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';
import {triplesForPath} from "@lblod/submission-form-helpers";
import rdflib from "browser-rdflib";
import {v4 as uuidv4} from 'uuid';

const BASE = 'http://data.lblod.info/form-fields/date-range/';
const PREFIX = new rdflib.Namespace(BASE);


export default class FormInputFieldsDateRangeEditComponent extends SimpleInputFieldComponent {
  inputId = 'date-range-' + guidFor(this);

  @tracked subject = null
  @tracked from;
  @tracked to;

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    const triples = matches.triples;

    if (triples.length) {
      this.subject = triples[0].object; // assuming only one per form
      // we assume if we have an object, dates were set
      this.from = this.storeOptions.store.match(this.subject, PREFIX('from'), undefined, this.storeOptions.sourceGraph)[0].object.value
      this.to = this.storeOptions.store.match(this.subject, PREFIX('to'), undefined, this.storeOptions.sourceGraph)[0].object.value
    }
  }

  get isEnabled() {
    return !!this.subject
  }

  @action
  reset() {
    const triples = [
      ...this.storeOptions.store.match(this.subject, undefined, undefined, this.storeOptions.sourceGraph),
      {
        subject: this.storeOptions.sourceNode,
        predicate: this.storeOptions.path,
        object: this.subject,
        graph: this.storeOptions.sourceGraph
      }
    ];
    this.subject = null;
    this.storeOptions.store.removeStatements(triples);
    this.loadProvidedValue();
  }

  @action
  enable() {
    this.subject = new rdflib.NamedNode(`${BASE}${uuidv4()}`);

    const yesterday = moment().subtract(1, 'day').startOf('day');

    const today = moment().endOf('day');

    this.updateDate(yesterday.toDate(), PREFIX('from'));
    this.updateDate(today.toDate(), PREFIX('to'));
    super.updateValue(this.subject)
  }

  updateDate(date, prefix) {
    // Remove the old
    let triples = this.storeOptions.store.match(this.subject, prefix, undefined, this.storeOptions.sourceGraph);
    this.storeOptions.store.removeStatements(triples);

    // In with the new
    triples = [{
      subject: this.subject,
      predicate: prefix,
      object: date.toISOString(),
      graph: this.storeOptions.sourceGraph
    }];
    this.storeOptions.store.addAll(triples);
  }

  @action
  updateFrom(date) {
    this.updateDate(date, PREFIX('from'));
    this.loadProvidedValue();
  }

  @action
  updateTo(date) {
    this.updateDate(date, PREFIX('to'));
    this.loadProvidedValue();
  }


}
