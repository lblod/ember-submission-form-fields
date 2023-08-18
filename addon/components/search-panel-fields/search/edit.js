import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '../../rdf-input-fields/simple-value-input-field';
import { restartableTask, timeout } from 'ember-concurrency';
import { scheduleOnce } from '@ember/runloop';

export default class FormSearchPanelFieldsSearchEditComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);

  @tracked _freeTextSearch = null;

  constructor() {
    super(...arguments);
    scheduleOnce('afterRender', this, 'setFreeTextSearch');
  }

  setFreeTextSearch() {
    if (!this._freeTextSearch) {
      this._freeTextSearch = this.value;
    }
  }

  updateValue = restartableTask(async () => {
    await timeout(250);
    this.value = this._freeTextSearch && this._freeTextSearch.trim();
    super.updateValue(this.value);
  });
}
