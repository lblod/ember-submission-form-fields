import { action } from '@ember/object';
import { triplesForPath, addSimpleFormValue, removeDatasetForSimpleFormValue } from '@lblod/submission-form-helpers';
import RDFInputFieldsConceptSchemeMultiSelectCheckboxesShowComponent from './show';

export default class RDFInputFieldsConceptSchemeMultiSelectCheckboxesEditComponent extends RDFInputFieldsConceptSchemeMultiSelectCheckboxesShowComponent {

  constructor() {
    super(...arguments);
  }

  @action
  updateValue(option) {
    const update = (option) => {
      /**
       * NOTE: Retrieve option from store, if found we assume it was selected before and needs to be removed
       */
      const matches = triplesForPath(this.storeOptions, true).values.map(value => value.value);
      if (matches.includes(option.subject.value)) {
        removeDatasetForSimpleFormValue(option.subject, this.storeOptions);
      } else {
        addSimpleFormValue(option.subject, this.storeOptions);
      }
      this.hasBeenFocused = true;
      super.updateValidations();
    };
    setTimeout(() => update(option), 1);
  }
}

