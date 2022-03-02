import SimpleInputFieldComponent from '../simple-value-input-field';
import { formatDate } from '@lblod/ember-submission-form-fields/utils/date';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsDateTimeShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-time-' + guidFor(this);

  get formattedDate() {
    return this.value ? formatDate(new Date(this.value)) : '';
  }
}
