import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfInputFieldsInputComponent extends SimpleInputFieldComponent {
  inputId = 'input-' + guidFor(this);

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    super.updateValue(this.value && this.value.trim());
  }
}
