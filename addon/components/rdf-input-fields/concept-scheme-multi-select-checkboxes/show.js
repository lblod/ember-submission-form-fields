import InputFieldComponent from '../input-field';
import { guidFor } from '@ember/object/internals';
import { tracked } from '@glimmer/tracking';
import { SKOS } from '@lblod/submission-form-helpers';
import rdflib from 'browser-rdflib';

export default class RDFInputFieldsConceptSchemeMultiSelectCheckboxesShowComponent extends InputFieldComponent {
  id = 'multi-select-checkboxes-' + guidFor(this);

  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadOptions();
  }

  get isColumnLayout(){
    /**
     * NOTE:  current implementation requires that if a checkbox label goes over or equals the length of 50,
     *        the column layout is abandoned.
     */
    return !this.options.find(option => option.label.length >= 50 );
  }

  loadOptions() {
    const store = this.args.formStore;
    const {sourceGraph, metaGraph} = this.args.graphs;
    const path = this.args.field.rdflibPath;
    const options = JSON.parse(this.args.field.options);
    const scheme = new rdflib.namedNode(options.conceptScheme);

    let orderBy;
    if (options.orderBy)
      orderBy = new rdflib.namedNode(options.orderBy);

    this.options = store.match(undefined, SKOS('inScheme'), scheme, metaGraph).map(t => {
      const subject = t.subject;
      const label = store.any(subject, SKOS('prefLabel'), undefined, metaGraph).value;
      const provided = !!store.any(undefined, path, subject, sourceGraph);

      let order = 0;
      if (orderBy)
        order = parseInt(store.any(subject, orderBy, undefined, metaGraph).value);

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

