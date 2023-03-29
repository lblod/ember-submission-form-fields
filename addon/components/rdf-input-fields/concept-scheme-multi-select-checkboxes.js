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
    const store = this.args.formStore;
    const { sourceGraph, metaGraph } = this.args.graphs;
    const path = this.args.field.rdflibPath;
    const options = this.args.field.options;
    const scheme = new namedNode(options.conceptScheme);

    let orderBy;
    if (options.orderBy) orderBy = new namedNode(options.orderBy);

    this.options = store
      .match(undefined, SKOS('inScheme'), scheme, metaGraph)
      .map((t) => {
        const subject = t.subject;
        const label = store.any(
          subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph
        ).value;
        const provided = !!store.any(
          this.storeOptions.sourceNode,
          path,
          subject,
          sourceGraph
        );

        let order = 0;
        if (orderBy)
          order = parseInt(
            store.any(subject, orderBy, undefined, metaGraph).value
          );

        return {
          subject,
          label,
          provided,
          order,
        };
      });
    this.options.sort((a, b) => a.order - b.order);
  }
}
