import SimpleInputFieldComponent from '../simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsDateShowComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);
}
