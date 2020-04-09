import AbstractInputFieldComponent from '../abstract-input-field';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { triplesForPath } from '../../../utils/import-triples-for-form';
import { SKOS } from '../../../utils/namespaces';
import rdflib from 'browser-rdflib';

export default class FormInputFieldsConceptSchemeSelectorShowComponent extends AbstractInputFieldComponent {
  @tracked selected = null
  @tracked options = []

  @action
  loadData(){
    super.loadData();
    this.loadOptions();
    this.loadProvidedValue();
  }

  loadOptions(){
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = JSON.parse(this.args.field.options);
    const conceptScheme = new rdflib.namedNode(fieldOptions.conceptScheme);

    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map(t => {
        const label = this.args.formStore.any(t.subject, SKOS('prefLabel'), undefined, metaGraph);
        return { subject: t.subject, label: label && label.value };
      });
  }

  loadProvidedValue() {
    if (this.isValid) {
      // Assumes valid input
      // This means even though we can have multiple values for one path (e.g. rdf:type)
      // this selector will only accept one value, and we take the first value from the matches.
      // The validation makes sure the matching value is the sole one.
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.find(opt => matches.find(m => m.equals(opt.subject)));
    }
  }
}
