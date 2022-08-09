import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { XSD } from '@lblod/submission-form-helpers';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import {
  DUTCH_LOCALIZATION,
  BELGIAN_FORMAT_ADAPTER,
} from '@lblod/ember-submission-form-fields/config/date-picker';
import rdflib from 'browser-rdflib';

export default class RdfInputFieldsDateComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);
  localization = DUTCH_LOCALIZATION;
  adapter = BELGIAN_FORMAT_ADAPTER;

  @action
  updateValue(isoDate) {
    const newDate = isoDate ? rdflib.literal(isoDate, XSD('date')) : null;
    super.updateValue(newDate);
  }
}
