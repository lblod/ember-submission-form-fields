import { action } from '@ember/object';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { triplesForPath } from '@lblod/submission-form-helpers';
import { Literal } from 'rdflib';

// Note : default values are not working yet with this component, loadProvidedValue is overriden

export default class RdfInputFieldsCheckboxComponent extends SimpleInputFieldComponent {
  HelpText = HelpText;
  loadProvidedValue() {
    const matches = triplesForPath(this.storeOptions);
    if (matches.values.length > 0) {
      this.nodeValue = matches.values[0];
      this.value = Literal.toJS(this.nodeValue);
    }
  }

  @action
  updateValue(checked) {
    this.value = checked;
    super.updateValue(this.value);
  }
}
