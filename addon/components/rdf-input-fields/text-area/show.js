import SimpleInputFieldComponent from '../simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsTextAreaShowComponent extends SimpleInputFieldComponent {
  inputId = 'textarea-' + guidFor(this);
}
