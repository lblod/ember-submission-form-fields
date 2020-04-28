import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import rdflib from 'browser-rdflib';
import { updateSimpleFormValue } from '@lblod/submission-form-helpers';
import { XSD } from '@lblod/submission-form-helpers';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsDateEditComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);

  @action
  updateValue(newValue) {
    let dateString = null;
    if(newValue != null) {
      dateString = newValue.toISOString().split("T")[0];
    }
    const newDate = dateString ? rdflib.literal(dateString, XSD('date')) : null;
    super.updateValue(newDate);
  }
}
