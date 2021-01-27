import InputFieldComponent from '../input-field';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';
import SimpleInputFieldComponent from '../simple-value-input-field';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class RdfInputFieldsConceptSchemeRadioButtonsShowComponent extends SimpleInputFieldComponent {
  inputId = 'concept-scheme-radio-buttons-' + guidFor(this);

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

}
