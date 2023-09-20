import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../../rdf-input-fields/simple-value-input-field';
import { restartableTask, timeout } from 'ember-concurrency';

export default class FormSearchPanelFieldsSearchEditComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);

  search = restartableTask(async (event) => {
    await timeout(250);
    this.value = event.target.value.trim();
    this.updateValue(this.value);
  });
}
