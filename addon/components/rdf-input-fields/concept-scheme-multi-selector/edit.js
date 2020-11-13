import InputFieldComponent from '../input-field';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { triplesForPath, updateSimpleFormValue } from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import { timeout } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import rdflib from 'browser-rdflib';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class FormInputFieldsConceptSchemeSelectorEditComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);

  @tracked selected = null;
  @tracked options = [];

  get subset() {
    return this.options.slice(0, 50);
  }

  constructor() {
    super(...arguments);
    this.loadOptions();
    this.loadProvidedValue();
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = JSON.parse(this.args.field.options);
    const conceptScheme = new rdflib.namedNode(fieldOptions.conceptScheme);

    this.options = this.args.formStore.match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
    .map(t => {
      const label = this.args.formStore.any(t.subject, SKOS('prefLabel'), undefined, metaGraph);
      return {subject: t.subject, label: label && label.value};
    });
    this.options.sort(byLabel);
  }

  loadProvidedValue() {
    if (this.isValid) {
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.filter(opt => matches.find(m => m.equals(opt.subject)));
    }
  }

  @action
  updateSelection(options) {
    this.selected = options;

    // Retrieve options in store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches
    .filter(m => this.options.find(opt => m.equals(opt.subject)));

    // Cleanup old value(s) in the store
   matchingOptions
    .filter(m => !options.find(opt => m.equals(opt.subject)))
    .forEach(m => updateSimpleFormValue(this.storeOptions, undefined, m));

    // Insert new value in the store
    options
    .filter(opt => !matchingOptions.find(m => opt.subject.equals(m)))
    .forEach(option => updateSimpleFormValue(this.storeOptions, option.subject));

    this.hasBeenFocused = true;
    super.updateValidations();
  }

  @restartableTask
  * search(term) {
    yield timeout(600);
    return this.options.filter(value => value.label.toLowerCase().includes(term.toLowerCase()));
  }
}
