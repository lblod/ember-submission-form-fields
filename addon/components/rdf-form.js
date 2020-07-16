import Component from '@glimmer/component';
import { fieldsForForm } from '@lblod/submission-form-helpers';
import { createPropertyTreeFromFields, getTopLevelPropertyGroups } from '../utils/model-factory';
import { A } from '@ember/array';

export default class RdfForm extends Component {
  propertyGroups = A();

  constructor() {
    super(...arguments);
    this.propertyGroups = this.getPropertyGroups(
      this.args.formStore,
      this.args.graphs,
    );
  }

  getPropertyGroups(store, graphs) {
    return getTopLevelPropertyGroups({store, graphs});
  }
}
