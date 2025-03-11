import { guidFor } from '@ember/object/internals';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import { restartableTask, timeout } from 'ember-concurrency';

export default class RdfInputFieldsSearchComponent extends SimpleInputFieldComponent {
  inputId = 'search-' + guidFor(this);
  HelpText = HelpText;

  search = restartableTask(async (event) => {
    await timeout(250);
    this.updateValue(event.target.value);
  });
}
