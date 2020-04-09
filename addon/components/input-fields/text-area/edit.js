import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { updateSimpleFormValue } from '../../../utils/import-triples-for-form';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsTextAreaEditComponent extends SimpleInputFieldComponent {
  inputId = 'textarea-' + guidFor(this);

  @action
  updateValue(e) {
    e.preventDefault();
    updateSimpleFormValue(this.storeOptions, this.value && this.value.trim(), this.nodeValue);
    this.hasBeenModified = true;
    this.loadData();
  }
}
