import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { updateSimpleFormValue } from '../../../../utils/import-triples-for-form';

export default class FormInputFieldsInputEditComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e){
    e.preventDefault();
    updateSimpleFormValue(this.storeOptions, this.value && this.value.trim(), this.nodeValue);
    this.hasBeenModified = true;
    this.loadData();
  }
}
