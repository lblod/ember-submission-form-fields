import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';

export default class RdfInputFieldsTextAreaComponent extends SimpleInputFieldComponent {
  inputId = 'textarea-' + guidFor(this);

  @action
  updateValue(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    this.value = e.target.value.trim();
    super.updateValue(this.value);
  }
}
