import SimpleInputFieldComponent from '../simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormInputFieldsSearchShowComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);
}
