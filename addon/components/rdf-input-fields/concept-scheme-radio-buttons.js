import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import SimpleInputFieldComponent from '@lblod/ember-submission-form-fields/components/rdf-input-fields/simple-value-input-field';
import { SKOS } from '@lblod/submission-form-helpers';
import { namedNode } from 'rdflib';
import { hasValidFieldOptions } from '../../utils/has-valid-field-options';

export default class RdfInputFieldsConceptSchemeRadioButtonsComponent extends SimpleInputFieldComponent {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  loadOptions() {
    const fieldOptions = this.args.field.options;
    let orderBy = null;

    if (!hasValidFieldOptions(this.args.field, ['conceptScheme'])) {
      return;
    }

    if (hasValidFieldOptions(this.args.field, ['orderBy'])) {
      orderBy = new namedNode(fieldOptions.orderBy);
    }

    const conceptScheme = new namedNode(fieldOptions.conceptScheme);
    this.options = this.args.formStore
      .match(undefined, SKOS('inScheme'), conceptScheme, this.metaGraph)
      .map((t) => {
        const label = this.args.formStore.any(
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
    const orderStatement = this.args.formStore.any(
      tripleSubject,
      orderBy,
      undefined,
      this.metaGraph
    );

    if (orderStatement) {
      return orderStatement.value;
    }

    return 0;
  }

  get metaGraph() {
    return this.args.graphs.metaGraph;
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
