import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { triplesForPath } from '@lblod/submission-form-helpers';

// TODO: the components this wraps does not have a "disabled" styling
export default class FormInputFieldsSwitchShowComponent extends SimpleInputFieldComponent {
  inputId = 'switch-' + guidFor(this);

  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    if (matches.values.length > 0) {
      this.nodeValue = matches.values[0];
      this.value = matches.values[0].value === '1'; // There is a bug in conversion from rdflib
    }
  }
}
