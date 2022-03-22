import SimpleInputFieldComponent from '../simple-value-input-field';
import { formatDate } from '@lblod/ember-submission-form-fields/utils/date';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsDateShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);

  get formattedDate() {
    return this.value ? formatDate(new Date(this.value)) : '';
  }
}
