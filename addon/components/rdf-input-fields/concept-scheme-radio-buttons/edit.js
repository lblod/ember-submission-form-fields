import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import SimpleInputFieldComponent from '../simple-value-input-field';
import { tracked } from '@glimmer/tracking';
import { triplesForPath, updateSimpleFormValue} from '@lblod/submission-form-helpers';
import { SKOS } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';


function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
}

export default class RdfInputFieldsconceptSchemeRadioButtonsEditComponent extends SimpleInputFieldComponent {
  inputId = 'conceptSchemeRadioButtons-' + guidFor(this);

  @tracked selected = null
  @tracked options = []
  constructor() {
    super(...arguments);
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
    const matches = triplesForPath(this.storeOptions, true).values;
    this.selected = this.options.find(opt => matches.find(m => m.equals(opt.subject)));
  }

  @action
  updateSelection(option){
    this.selected = option;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter(m => this.options.find(opt => m.equals(opt.subject)));
    matchingOptions.forEach(m => updateSimpleFormValue(this.storeOptions, undefined, m));

    // Insert new value in the store
    if (option) {
      updateSimpleFormValue(this.storeOptions, option.subject);
    }

    this.hasBeenFocused = true;
    super.updateValidations();
  }
}
