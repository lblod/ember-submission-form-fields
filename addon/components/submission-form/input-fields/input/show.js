import SimpleInputFieldComponent from '../simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsInputShowComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);
}
