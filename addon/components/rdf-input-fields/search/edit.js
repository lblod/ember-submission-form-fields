import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { restartableTask, timeout } from 'ember-concurrency';

export default class FormInputFieldsSearchEditComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);

  @restartableTask
  *search(event) {
    yield timeout(250);
    this.updateValue(event.target.value.trim());
  }
}
