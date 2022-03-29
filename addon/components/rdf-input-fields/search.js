import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { restartableTask, timeout } from 'ember-concurrency';

export default class RdfInputFieldsSearchComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);

  @restartableTask
  *search(event) {
    yield timeout(250);
    this.updateValue(event.target.value.trim());
  }
}
