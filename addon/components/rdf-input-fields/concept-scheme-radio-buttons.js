import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { SKOS } from '@lblod/submission-form-helpers';
import { namedNode } from 'rdflib';

export default class RdfInputFieldsConceptSchemeRadioButtonsComponent extends SimpleInputFieldComponent {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;
    const conceptScheme = new namedNode(fieldOptions.conceptScheme);
    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph
        );
        return {
          value: t.subject.value,
          nodeValue: t.subject,
          label: label && label.value,
        };
      });
    this.options.sort(byLabel);
  }

  @action
  updateValue(option) {
    setTimeout(() => super.updateValue(option.nodeValue), 1);
  }
}

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}
