import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { tracked } from '@glimmer/tracking';
import { guidFor } from '@ember/object/internals';
import { triplesForPath } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

export default class CustomSubsidyFormFieldsApplicationFormTableShowComponent extends InputFieldComponent  {

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    console.log('matches', matches)
  }
}
