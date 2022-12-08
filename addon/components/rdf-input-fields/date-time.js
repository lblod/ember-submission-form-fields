import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { triplesForPath, XSD } from '@lblod/submission-form-helpers';
import { literal } from 'rdflib';

export default class RdfInputFieldsDateTimeComponent extends SimpleInputFieldComponent {
  inputId = 'date-time-' + guidFor(this);

  @tracked value = null;
  @tracked hour = null;
  @tracked minutes = null;

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
  updateValue(isoDate, date) {
    // let updatedValue = null;
    // When using setHours, the time is transformed from universal time to local time,
    // which is causing mismatching dates.
    // We can comment it out because the user is not able to modfy the time in the frontend's datepicker.
    /* if (this.value) {
      this.value.setHours(this.hour, this.minutes, null, null);
      updatedValue = this.value.toISOString();
    } */
    const newValue = date ? literal(date.toISOString(), XSD('dateTime')) : null;
    super.updateValue(newValue);
    this.loadProvidedValue();
  }
}
