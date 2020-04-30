import SimpleInputFieldComponent from '../simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsDateTimeShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);
}
