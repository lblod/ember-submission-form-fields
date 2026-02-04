import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import InputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/input-field';
import HelpText from '@lblod/ember-submission-form-fields/components/private/help-text';
import {
  SKOS,
  triplesForPath,
  updateSimpleFormValue,
} from '@lblod/submission-form-helpers';
import { Literal, NamedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';
import { FIELD_OPTION } from '../../utils/namespaces';
import { byLabel, byOrder, getOrderForOption } from '../../-private/utils/sort';

export default class RdfInputFieldsConceptSchemeSelectorComponent extends InputFieldComponent {
  inputId = 'select-' + guidFor(this);
  HelpText = HelpText;

  @tracked selected = null;
  @tracked options = [];
  @tracked searchEnabled = true;

  constructor() {
    super(...arguments);

    this.loadOptions();
    this.loadProvidedValue();
  }

  loadOptions() {
    const fieldOptions = this.args.field.options;

    // Note: a mix of old spec and new spec is possible here.
    // Maybe add validation to enforce useage of one of the two specifications.
    let { conceptScheme, isSearchEnabled, orderBy } =
      this.getFieldOptionsByPredicates();

    // New form-spec for conceptScheme didn't yield result; trying old form-spec
    if (!conceptScheme) {
      if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
        // No conceptScheme found hence this component can't work.
        return;
      }
      conceptScheme = new NamedNode(fieldOptions.conceptScheme);
    }

    // SearchEnabled hasn't been found in the new spec, let's try matching it with the old spec.
    if (!isSearchEnabled) {
      if (fieldOptions.searchEnabled !== undefined) {
        this.searchEnabled = fieldOptions.searchEnabled;
      }
    } else {
      this.searchEnabled = Literal.toJS(isSearchEnabled);
    }

    this.options = this.store
      .match(undefined, SKOS('inScheme'), conceptScheme, this.metaGraph)
      .map((t) => {
        const label = this.store.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          this.metaGraph,
        );
        return {
          subject: t.subject,
          label: label && label.value,
          order: getOrderForOption(
            orderBy,
            t.subject,
            this.store,
            this.metaGraph,
          ),
        };
      });
    if (orderBy) {
      this.options.sort(byOrder);
    } else {
      this.options.sort(byLabel);
    }
  }

  loadProvidedValue() {
    if (this.isValid) {
      // Assumes valid input
      // This means even though we can have multiple values for one path (e.g. rdf:type)
      // this selector will only accept one value, and we take the first value from the matches.
      // The validation makes sure the matching value is the sole one.
      const matches = triplesForPath(this.storeOptions, true).values;
      this.selected = this.options.find((opt) =>
        matches.find((m) => m.equals(opt.subject)),
      );
    }
  }

  @action
  updateSelection(option) {
    this.selected = option;

    // Cleanup old value(s) in the store
    const matches = triplesForPath(this.storeOptions, true).values;
    const matchingOptions = matches.filter((m) =>
      this.options.find((opt) => m.equals(opt.subject)),
    );
    matchingOptions.forEach((m) =>
      updateSimpleFormValue(this.storeOptions, undefined, m),
    );

    // Insert new value in the store
    if (option) {
      updateSimpleFormValue(this.storeOptions, option.subject);
    }

    this.hasBeenFocused = true;
    super.updateValidations();
  }

  getFieldOptionsByPredicates() {
    return {
      conceptScheme: this.args.formStore.any(
        this.args.field.uri,
        FIELD_OPTION('conceptScheme'),
        undefined,
        this.args.graphs.formGraph,
      ),
      isSearchEnabled: this.args.formStore.any(
        this.args.field.uri,
        FIELD_OPTION('searchEnabled'),
        undefined,
        this.args.graphs.formGraph,
      ),
      orderBy: this.args.formStore.any(
        this.args.field.uri,
        FIELD_OPTION('orderBy'),
        undefined,
        this.args.graphs.formGraph,
      ),
    };
  }

  get metaGraph() {
    return this.args.graphs.metaGraph;
  }

  get store() {
    return this.args.formStore;
  }
}
