import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import {
  importTriplesForForm,
  validateForm,
} from '@lblod/ember-submission-form-fields';
import { action } from '@ember/object';
import { NamedNode, Namespace } from 'rdflib';

export default class FormController extends Controller {
  @tracked datasetTriples = [];
  @tracked forceShowErrors = false;
  @tracked sourceTtl = '';
  constructor() {
    super(...arguments);
  }

  get formStore() {
    return this.model.formStore;
  }

  get graphs() {
    return this.model.graphs;
  }

  get sourceNode() {
    return this.model.sourceNode;
  }

  get form() {
    return this.model.form;
  }

  registerObserver() {
    this.formStore.registerObserver(() => {
      this.setTriplesForTables();
    });
  }

  setTriplesForTables() {
    this.datasetTriples = importTriplesForForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });
    this.datasetTriples = this.formStore.match(
      undefined,
      undefined,
      undefined,
      this.graphs.sourceGraph
    );
  }

  @action
  validate() {
    const result = validateForm(this.form, {
      ...this.graphs,
      sourceNode: this.sourceNode,
      store: this.formStore,
    });

    this.forceShowErrors = !result;
  }

  @action
  serializeSourceToTtl() {
    this.sourceTtl = this.formStore.serializeDataMergedGraph(new NamedNode(`http://data.lblod.info/sourcegraph`));
  }
}
