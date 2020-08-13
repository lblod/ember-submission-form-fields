import SimpleInputFieldComponent from '../../rdf-input-fields/simple-value-input-field';
import { guidFor } from '@ember/object/internals';

export default class FormSearchPanelFieldsSearchShowComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);
}
