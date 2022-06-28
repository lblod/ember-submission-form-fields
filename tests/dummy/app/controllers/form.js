import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { importTriplesForForm } from '@lblod/ember-submission-form-fields';

export default class FormController extends Controller {
  @tracked datasetTriples = [];

  constructor() {
    super(...arguments);
    //    this.registerObserver();
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
    //TODO:figure out why it is ot working
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
}
