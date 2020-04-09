import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { validationResultsForField, validationTypesForField } from '../../../utils/import-triples-for-form';

/**
 * Abstract input-field component providing a base class
 * for the custom input-fields
*/
export default class InputFieldComponent extends Component {
  @tracked validations = []

  get errors() {
    return this.validations.filter(r => !r.valid);
  }

  get isValid() {
    return this.errors.length == 0;
  }

  get isRequired() {
    const validationTypes = validationTypesForField(this.args.field.uri, this.storeOptions);
    return validationTypes.any(v => v.value == 'http://lblod.data.gift/vocabularies/forms/RequiredConstraint');
  }

  get storeOptions() {
    return {
      formGraph: this.args.graphs.formGraph,
      sourceGraph: this.args.graphs.sourceGraph,
      metaGraph: this.args.graphs.metaGraph,
      sourceNode: this.args.sourceNode,
      store: this.args.formStore,
      path: this.args.field.rdflibPath
    };
  }

  loadData() {
    this.loadValidations();
  }

  loadValidations() {
    this.validations = validationResultsForField(this.args.field.uri, this.storeOptions);
  }
}
