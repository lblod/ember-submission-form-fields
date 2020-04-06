import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import rdflib from 'browser-rdflib';
import { updateSimpleFormValue } from '../../../utils/import-triples-for-form';
import { XSD } from '../../../utils/namespaces';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsDateEditComponent extends SimpleInputFieldComponent {
  inputId = 'date-' + guidFor(this);

  @action
  updateValue(newValue){
    let dateString = null;
    if(newValue != null) {
      dateString = newValue.toISOString().split("T")[0];
    }
    const newDate = rdflib.literal(dateString, XSD('date'));
    updateSimpleFormValue(this.storeOptions, newDate, this.nodeValue);
    this.loadData();
  }
}
