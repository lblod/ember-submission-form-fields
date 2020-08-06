import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import rdflib from 'browser-rdflib';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { XSD } from '@lblod/submission-form-helpers';
import SimpleInputFieldComponent from '../simple-value-input-field';

export default class FormInputFieldsDateTimeEditComponent extends SimpleInputFieldComponent {
  inputId = 'date-time-' + guidFor(this);

  @tracked value = null
  @tracked hour = null
  @tracked minutes = null

  constructor() {
    super(...arguments);
    this.loadProvidedValue();
  }

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    if (matches.values.length > 0) {
      this.nodeValue = matches.values[0];
      const datobj = new Date(this.nodeValue.value);
      this.value = datobj;
      this.hour = datobj.getHours();
      this.minutes = datobj.getMinutes();
    }
  }

  @action
  updateValue() {
    let updatedValue = null;
    // When using setHours, the time is transformed from universal time to local time,
    // which is causing mismatching dates.
    // We can comment it out because the user is not able to modfy the time in the frontend's datepicker.
    /* if (this.value) {
      this.value.setHours(this.hour, this.minutes, null, null);
      updatedValue = this.value.toISOString();
    } */
    const newValue = this.value ? rdflib.literal(this.value.toISOString(), XSD('dateTime')) : null;
    super.updateValue(newValue);
    this.loadProvidedValue();
  }
}
