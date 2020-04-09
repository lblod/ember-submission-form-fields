import InputFieldComponent from '../input-field';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { triplesForPath, updateSimpleFormValue} from '../../../utils/import-triples-for-form';
import { SKOS } from '../../../utils/namespaces';
import rdflib from 'browser-rdflib';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class FormInputFieldsConceptSchemeSelectorEditComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this); // this input field is not linked to the label yet, this technique does not work with the power-select

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
    this.options.sort(byLabel);
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

  @action
  updateSelection(option){
    this.selected = option;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter(m => this.options.find(opt => m.equals(opt.subject)));
    matchingOptions.forEach(m => updateSimpleFormValue(this.storeOptions, undefined, m));

    // Insert new value in the store
    if(option){
      updateSimpleFormValue(this.storeOptions, option.subject);
    }
    this.hasBeenModified = true;
    this.loadData();
  }
}
