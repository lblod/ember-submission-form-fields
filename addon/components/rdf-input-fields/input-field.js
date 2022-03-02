import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  removeTriples,
  validationResultsForField,
  validationTypesForField,
} from '@lblod/submission-form-helpers';
import { RDF, FORM } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

const MAX_LENGTH_URI = 'http://lblod.data.gift/vocabularies/forms/MaxLength';
/**
 * Abstract input-field component providing a base class
 * for the custom input-fields
 */
export default class InputFieldComponent extends Component {
  @tracked validations = [];

  @tracked hasBeenFocused = false;

  constructor() {
    super(...arguments);
    this.updateValidations();
  }

  get canShowErrors() {
    return this.hasBeenFocused || this.args.forceShowErrors;
  }

  get errors() {
    if (this.canShowErrors) return this.validations.filter((r) => !r.valid);
    else return [];
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  get isValid() {
    return this.validations.filter((r) => !r.valid).length === 0;
  }

  get validationConstraints() {
    const { store, formGraph } = this.storeOptions;
    return store
      .match(this.args.field.uri, FORM('validations'), undefined, formGraph)
      .map((t) => t.object);
  }

  get isRequired() {
    const validationTypes = validationTypesForField(
      this.args.field.uri,
      this.storeOptions
    );
    return validationTypes.some(
      (v) =>
        v.value ===
        'http://lblod.data.gift/vocabularies/forms/RequiredConstraint'
    );
  }

  get maxLength() {
    const { store, formGraph } = this.storeOptions;
    const constraint = this.validationConstraints.find((constraint) =>
      store.any(
        constraint,
        RDF('type'),
        new rdflib.NamedNode(MAX_LENGTH_URI),
        formGraph
      )
    );
    if (constraint) {
      return Number(
        store.any(constraint, FORM('max'), undefined, formGraph).value
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
    };
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (!this.args.cacheConditionals) {
      removeTriples(this.storeOptions);
    }
  }

  updateValidations() {
    this.validations = validationResultsForField(
      this.args.field.uri,
      this.storeOptions
    );
  }
}
