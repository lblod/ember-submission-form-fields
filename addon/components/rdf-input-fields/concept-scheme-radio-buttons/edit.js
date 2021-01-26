import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import SimpleInputFieldComponent from '../simple-value-input-field';
import { tracked } from '@glimmer/tracking';
import { SKOS } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';


function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class RdfInputFieldsconceptSchemeRadioButtonsEditComponent extends SimpleInputFieldComponent {
  inputId = 'conceptSchemeRadioButtons-' + guidFor(this);

  @tracked options = []

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  loadOptions(){
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = JSON.parse(this.args.field.options);
    const conceptScheme = new rdflib.namedNode(fieldOptions.conceptScheme);
    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map(t => {
        const label = this.args.formStore.any( t.subject, SKOS('prefLabel'), undefined, metaGraph);
        return { value: t.subject.value, nodeValue: t.subject, label: label && label.value };
      });
    this.options.sort(byLabel);
  }

  @action
  updateValue(option) {
    super.updateValue(option.nodeValue);
  }
}
