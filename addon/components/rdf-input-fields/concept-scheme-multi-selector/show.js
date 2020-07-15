import InputFieldComponent from '../input-field';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class FormInputFieldsConceptSchemeSelectorShowComponent extends InputFieldComponent {
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

    this.options = this.args.formStore.match(undefined, SKOS('inScheme'), conceptScheme, metaGraph).map(t => {
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
}
