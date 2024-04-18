import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { SKOS } from '@lblod/submission-form-helpers';
import { namedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';
import { FORM_OPTION } from '../../utils/namespaces';

export default class RdfInputFieldsConceptSchemeRadioButtonsComponent extends SimpleInputFieldComponent {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  // Duplicate method in conceptscheme selector
  // Difference in this.store
  findFieldOptionByPredicate(predicate) {
    return this.store.any(
      this.args.field.uri,
      FORM_OPTION(predicate),
      undefined,
      this.args.graphs.formGraph
    );
  }

  loadOptions() {
    const fieldOptions = this.args.field.options;
    let conceptScheme = this.findFieldOptionByPredicate('conceptScheme');
    let orderBy = this.findFieldOptionByPredicate('orderBy');

    if (!conceptScheme) {
      if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
        return;
      }
      conceptScheme = new namedNode(fieldOptions.conceptScheme);
    }

    if (!orderBy) {
      if (hasValidFieldOptions(this.args.field, ['orderBy'])) {
        orderBy = new namedNode(fieldOptions.orderBy);
      }
    }

    this.options = this.store
      .match(undefined, SKOS('inScheme'), conceptScheme, this.metaGraph)
      .map((t) => {
        const label = this.store.any(
          t.subject,
          SKOS('prefLabel'),
          undefined,
          this.metaGraph
        );
        return {
          value: t.subject.value,
          nodeValue: t.subject,
          label: label && label.value,
          order: this.getOrderForOption(orderBy, t.subject),
        };
      });

    if (orderBy) {
      this.options.sort(byOrder);
    } else {
      this.options.sort(byLabel);
    }
  }

  @action
  updateValue(option) {
    setTimeout(() => super.updateValue(option.nodeValue), 1);
  }

  getOrderForOption(orderBy, tripleSubject) {
    const orderStatement = this.store.any(
      tripleSubject,
      orderBy,
      undefined,
      this.metaGraph
    );

    // This MUST be a string so our byOrder sorting function returns the correct result
    return `${orderStatement?.value ?? ''}`;
  }

  get metaGraph() {
    return this.args.graphs.metaGraph;
  }

  get store() {
    return this.args.formStore;
  }
}

function byLabel(a, b) {
  const textA = a.label.toUpperCase();
  const textB = b.label.toUpperCase();
  return textA < textB ? -1 : textA > textB ? 1 : 0;
}

function byOrder(a, b) {
  return a.order.localeCompare(b.order, undefined, { numeric: true });
}
