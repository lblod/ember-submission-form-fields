import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import {
  SKOS,
  triplesForPath,
  updateSimpleFormValue,
} from '@lblod/submission-form-helpers';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import { restartableTask, timeout } from 'ember-concurrency';
import { Literal, namedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';
import { FIELD_OPTION } from '../../utils/namespaces';

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

export default class RdfInputFieldsConceptSchemeMultiSelectorComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);

  @tracked selected = null;
  @tracked options = [];
  @tracked searchEnabled = true;

  get subset() {
    return this.options.slice(0, 50);
  }

  constructor() {
    super(...arguments);
    this.loadOptions();
    this.loadProvidedValue();
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;

    // Note: a mix of old spec and new spec is possible here.
    // Maybe add validation to enforce useage of one of the two specifications.
    let { conceptScheme, isSearchEnabled } = this.getFieldOptionsByPredicates();

    // New form-spec for conceptScheme didn't yield result; trying old form-spec
    if (!conceptScheme) {
      if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
        // No conceptScheme found hence this component can't work.
        return;
      }
      conceptScheme = new namedNode(fieldOptions.conceptScheme);
    }

    // SearchEnabled hasn't been found in the new spec, let's try matching it with the old spec.
    if (!isSearchEnabled) {
      if (fieldOptions.searchEnabled !== undefined) {
        this.searchEnabled = fieldOptions.searchEnabled;
      }
    } else {
      this.searchEnabled = Literal.toJS(isSearchEnabled);
    }

    this.options = this.args.formStore
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
    this.options.sort(byLabel);
  }

  loadProvidedValue() {
    if (this.isValid) {
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.filter((opt) =>
        matches.find((m) => m.equals(opt.subject))
      );
    }
  }

  @action
  updateSelection(options) {
    this.selected = options;

    // Retrieve options in store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter((m) =>
      this.options.find((opt) => m.equals(opt.subject))
    );

    // Cleanup old value(s) in the store
    matchingOptions
      .filter((m) => !options.find((opt) => m.equals(opt.subject)))
      .forEach((m) => updateSimpleFormValue(this.storeOptions, undefined, m));

    // Insert new value in the store
    options
      .filter((opt) => !matchingOptions.find((m) => opt.subject.equals(m)))
      .forEach((option) =>
        updateSimpleFormValue(this.storeOptions, option.subject)
      );

    this.hasBeenFocused = true;
    super.updateValidations();
  }

  search = restartableTask(async (term) => {
    await timeout(600);
    return this.options.filter((value) =>
      value.label.toLowerCase().includes(term.toLowerCase())
    );
  });

  getFieldOptionsByPredicates() {
    return {
      conceptScheme: this.args.formStore.any(
        this.args.field.uri,
        FIELD_OPTION('conceptScheme'),
        undefined,
        this.args.graphs.formGraph
      ),
      isSearchEnabled: this.args.formStore.any(
        this.args.field.uri,
        FIELD_OPTION('searchEnabled'),
        undefined,
        this.args.graphs.formGraph
      ),
    };
  }
}
