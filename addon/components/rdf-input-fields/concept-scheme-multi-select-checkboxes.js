import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import {
  addSimpleFormValue,
  removeDatasetForSimpleFormValue,
  SKOS,
  triplesForPath,
} from '@lblod/submission-form-helpers';
import { namedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';

export default class RDFInputFieldsConceptSchemeMultiSelectCheckboxesComponent extends InputFieldComponent {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  get isColumnLayout() {
    /**
     * NOTE:  current implementation requires that if a checkbox label goes over or equals the length of 50,
     *        the column layout is abandoned.
     */
    return !this.options.find((option) => option.label.length >= 50);
  }

  @action
  updateValue(option) {
    const update = (option) => {
      /**
       * NOTE: Retrieve option from store, if found we assume it was selected before and needs to be removed
       */
      const matches = triplesForPath(this.storeOptions, true).values.map(
        (value) => value.value
      );
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

  loadOptions() {
    const path = this.args.field.rdflibPath;
    const fieldOptions = this.args.field.options;
    let orderBy = null;

    if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
      return;
    }

    if (hasValidFieldOptions(this.args.field, ['orderBy'])) {
      orderBy = new namedNode(fieldOptions.orderBy);
    }

    const conceptScheme = new namedNode(fieldOptions.conceptScheme);
    this.options = this.store
      .match(undefined, SKOS('inScheme'), conceptScheme, this.graphs.metaGraph)
      .map((t) => {
        const subject = t.subject;
        const label = this.store.any(
          subject,
          SKOS('prefLabel'),
          undefined,
          this.graphs.metaGraph
        ).value;
        const provided = !!this.store.any(
          this.storeOptions.sourceNode,
          path,
          subject,
          this.graphs.sourceGraph
        );

        return {
          subject,
          label,
          provided,
          order: this.getOrderForOption(orderBy, t.subject),
        };
      });

    this.options.sort((a, b) =>
      a.order.localeCompare(b.order, undefined, { numeric: true })
    );
  }

  getOrderForOption(orderBy, tripleSubject) {
    const orderStatement = this.store.any(
      tripleSubject,
      orderBy,
      undefined,
      this.graphs.metaGraph
    );

    // must be string because above we are using string.localCompare
    return `${orderStatement?.value ?? ''}`;
  }

  get store() {
    return this.args.formStore;
  }

  get graphs() {
    return this.args.graphs;
  }
}
