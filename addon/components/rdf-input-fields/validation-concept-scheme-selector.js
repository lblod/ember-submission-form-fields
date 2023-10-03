import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import {
  SKOS,
  triplesForPath,
  updateSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { Namespace, namedNode } from 'rdflib';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

export default class RdfInputFieldsValidationConceptSchemeSelectorComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);

  @tracked selected = null;
  @tracked options = [];
  @tracked searchEnabled = true;

  EXT = new Namespace('http://mu.semte.ch/vocabularies/ext/');
  FORM = new Namespace('http://lblod.data.gift/vocabularies/forms/');
  RDF = new Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');

  constructor() {
    super(...arguments);
    this.loadOptions();
    this.loadProvidedValue();
  }

  getPossibleValidationsForDisplayType(displayType, store, graphs) {
    return store
      .match(
        displayType,
        this.EXT('canHaveValidation'),
        undefined,
        graphs.metaGraph
      )
      .map((triple) => triple.object);
  }

  loadOptions() {
    const fieldDisplayType = this.args.formStore.any(
      this.EXT('formNodesNameF'),
      this.FORM('displayType'),
      undefined,
      this.args.graphs.formGraph
    );

    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;
    const conceptScheme = new namedNode(fieldOptions.conceptScheme);

    if (fieldOptions.searchEnabled !== undefined) {
      this.searchEnabled = fieldOptions.searchEnabled;
    }
    const conceptOptions = this.getPossibleValidationsForDisplayType(
      fieldDisplayType,
      this.args.formStore,
      this.args.graphs.sourceGraph
    );

    const allOptions = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          metaGraph
        );
        return { subject: t.subject, label: label && label.value };
      });

    this.options = allOptions.filter((option) => {
      return conceptOptions
        .map((concept) => concept.value)
        .includes(option.subject.value);
    });
    this.options.sort(byLabel);
  }

  loadProvidedValue() {
    if (this.isValid) {
      // Assumes valid input
      // This means even though we can have multiple values for one path (e.g. rdf:type)
      // this selector will only accept one value, and we take the first value from the matches.
      // The validation makes sure the matching value is the sole one.
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.find((opt) =>
        matches.find((m) => m.equals(opt.subject))
      );
    }
  }

  @action
  updateSelection(option) {
    this.selected = option;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter((m) =>
      this.options.find((opt) => m.equals(opt.subject))
    );
    matchingOptions.forEach((m) =>
      updateSimpleFormValue(this.storeOptions, undefined, m)
    );

    // Insert new value in the store
    if (option) {
      updateSimpleFormValue(this.storeOptions, option.subject);
    }

    this.hasBeenFocused = true;
    super.updateValidations();
  }
}
