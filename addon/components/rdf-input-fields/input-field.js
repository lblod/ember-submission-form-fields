import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  FORM,
  removeTriples,
  SHACL,
  validationResultsForField,
  validationsForFieldWithType,
} from '@lblod/submission-form-helpers';

const MAX_LENGTH_URI = 'http://lblod.data.gift/vocabularies/forms/MaxLength';
const SH_WARNING = SHACL('Warning');

/**
 * Abstract input-field component providing a base class
 * for the custom input-fields
 */
export default class InputFieldComponent extends Component {
  @tracked errorValidations = [];
  @tracked warningValidations = [];

  @tracked hasBeenFocused = false;

  constructor() {
    super(...arguments);
    this.updateValidations();
  }

  get canShowValidationMessages() {
    return this.hasBeenFocused || this.args.forceShowErrors;
  }

  get errors() {
    return this.canShowValidationMessages ? this.errorValidations : [];
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  get warnings() {
    return this.canShowValidationMessages ? this.warningValidations : [];
  }

  get hasWarnings() {
    return this.warnings.length > 0;
  }

  get isValid() {
    return !this.hasErrors;
  }

  get constraints() {
    return validationsForFieldWithType(this.args.field.uri, this.storeOptions);
  }

  get isRequired() {
    return (
      !this.args.show &&
      this.constraints.some(
        (constraint) =>
          constraint.type.value ===
          'http://lblod.data.gift/vocabularies/forms/RequiredConstraint',
      )
    );
  }

  get maxLength() {
    const { store, formGraph } = this.storeOptions;

    const constraint = this.constraints.find(
      (constraint) => constraint.type.value === MAX_LENGTH_URI,
    );
    if (constraint) {
      return Number(
        store.any(constraint.constraintUri, FORM('max'), undefined, formGraph)
          .value,
      );
    }
    return constraint;
  }

  get remainingCharacters() {
    if (this.value) {
      return this.maxLength - this.value.length;
    }
    return this.maxLength;
  }

  get hasRemainingCharacters() {
    return this.remainingCharacters >= 0;
  }

  get defaultValue() {
    return this.args.field.defaultValue;
  }

  get storeOptions() {
    return {
      formGraph: this.args.graphs.formGraph,
      sourceGraph: this.args.graphs.sourceGraph,
      metaGraph: this.args.graphs.metaGraph,
      sourceNode: this.args.sourceNode,
      store: this.args.formStore,
      path: this.args.field.rdflibPath,
      scope: this.args.field.rdflibScope,
    };
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (!this.args.cacheConditionals) {
      removeTriples(this.storeOptions);
    }
  }

  updateValidations() {
    this.errorValidations = invalidResults(
      validationResultsForField(this.args.field.uri, this.storeOptions),
    );

    this.warningValidations = invalidResults(
      validationResultsForField(this.args.field.uri, {
        ...this.storeOptions,
        severity: SH_WARNING,
      }),
    );
  }
}

function invalidResults(validationResults) {
  return validationResults.filter((result) => !result.valid);
}
