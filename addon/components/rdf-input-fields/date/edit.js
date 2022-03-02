import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import rdflib from 'browser-rdflib';
import { XSD } from '@lblod/submission-form-helpers';
import SimpleInputFieldComponent from '../simple-value-input-field';
import {
  DUTCH_LOCALIZATION,
  BELGIAN_FORMAT_ADAPTER,
} from '@lblod/ember-submission-form-fields/config/date-picker';

export default class FormInputFieldsDateEditComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);
  localization = DUTCH_LOCALIZATION;
  adapter = BELGIAN_FORMAT_ADAPTER;

  @action
  updateValue(isoDate) {
    const newDate = isoDate ? rdflib.literal(isoDate, XSD('date')) : null;
    super.updateValue(newDate);
  }
}
