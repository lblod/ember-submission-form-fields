import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

import SimpleInputFieldComponent from '../simple-value-input-field';
import { triplesForPath } from '@lblod/submission-form-helpers';

// Note : default values are not working yet with this component, loadProvidedValue is overriden

export default class FormInputFieldsSwitchEditComponent extends SimpleInputFieldComponent {
  inputId = 'switch-' + guidFor(this);

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    if (matches.values.length > 0) {
      this.nodeValue = matches.values[0];
      this.value = matches.values[0].value === '1'; // There is a bug in conversion from rdflib
    }
  }

  @action
  updateValue(checked) {
    this.value = checked;
    super.updateValue(this.value);
  }
}
