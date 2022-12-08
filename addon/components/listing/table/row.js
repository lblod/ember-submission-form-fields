import Component from '@glimmer/component';
import {
  getChildrenForPropertyGroup,
  getTopLevelPropertyGroups,
} from '@lblod/ember-submission-form-fields/utils/model-factory';

export default class ListingTableRow extends Component {
  constructor() {
    super(...arguments);

    let { formStore: store, graphs, sourceNode: node } = this.args;

    // We assume there will only ever be a single property group for the ListingTable
    let propertyGroups = getTopLevelPropertyGroups({
      store,
      graphs,
      form: this.args.subForm.uri,
    });

    this.fields = getChildrenForPropertyGroup(propertyGroups[0], {
      form: this.args.subForm.uri,
      store,
      graphs,
      node,
    });
  }
}
