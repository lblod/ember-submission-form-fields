import Component from '@glimmer/component';
import {fieldsForForm} from '@lblod/submission-form-helpers';
import {createPropertyTreeFromFields} from '../utils/model-factory';
import {A} from '@ember/array';

export default class SqConfigFormComponent extends Component {
  propertyGroups = A()

  constructor() {
    super(...arguments);
    this.propertyGroups = this.getPropertyGroups(
      this.args.formStore,
      this.args.graphs,
      this.args.sourceNode
    );
  }

  getPropertyGroups(store, graphs, sourceNode) {
    let fieldUris = fieldsForForm(this.args.form, {
      store,
      formGraph: graphs.formGraph,
      sourceGraph: graphs.sourceGraph,
      metaGraph: graphs.metaGraph,
      sourceNode
    });
    return createPropertyTreeFromFields(fieldUris, {store, formGraph: graphs.formGraph});
  }
}
