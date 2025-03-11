import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '../../rdf-input-fields/simple-value-input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { restartableTask, timeout } from 'ember-concurrency';

export default class FormSearchPanelFieldsSearchEditComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);
  HelpText = HelpText;

  search = restartableTask(async (event) => {
    await timeout(250);
    this.value = event.target.value;
    this.updateValue(this.value);
  });
}
