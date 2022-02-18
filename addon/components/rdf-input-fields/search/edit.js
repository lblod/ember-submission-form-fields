import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '../simple-value-input-field';
import { restartableTask, timeout } from 'ember-concurrency';

export default class FormInputFieldsSearchEditComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);

  @tracked _freeTextSearch = null;

  loadProvidedValue() {
    super.loadProvidedValue();
    if (!this._freeTextSearch) {
      this._freeTextSearch = this.value;
    }
  }

  @restartableTask
  * updateValue() {
    yield timeout(250);
    this.value = this._freeTextSearch && this._freeTextSearch.trim();
    super.updateValue(this.value);
  }
}
