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
import { namedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';
import { FORM_OPTION } from '../../utils/namespaces';

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

  // Duplicate method in conceptscheme selector
  // Difference in this.store
  findFieldOptionByPredicate(predicate) {
    return this.args.formStore.any(
      this.args.field.uri,
      FORM_OPTION(predicate),
      undefined,
      this.args.graphs.formGraph
    );
  }

  loadOptions() {
    const metaGraph = this.args.graphs.metaGraph;
    const fieldOptions = this.args.field.options;
    let conceptScheme = this.findFieldOptionByPredicate('conceptScheme');
    let isSearchEnabled = this.findFieldOptionByPredicate('searchEnabled');

    if (!conceptScheme) {
      if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
        return;
      }
      conceptScheme = new namedNode(fieldOptions.conceptScheme);
    }

    /**
     * NOTE: Most forms are now implemented to have a default "true" behavior
     */
    if (!isSearchEnabled) {
      if (!hasValidFieldOptions(this.args.field, ['searchEnabled'])) {
        return;
      }
      this.searchEnabled = fieldOptions.searchEnabled;
    } else {
      this.searchEnabled = isSearchEnabled == '1' ? true : false;
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
}
