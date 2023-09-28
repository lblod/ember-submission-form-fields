import Component from '@glimmer/component';
import {
  getChildrenForPropertyGroup,
  getTopLevelPropertyGroups,
} from '@lblod/ember-submission-form-fields/utils/model-factory';
import OrderButtonGroup from '@lblod/ember-submission-form-fields/components/listing/order-button-group';

export default class ListingTableRow extends Component {
  OrderButtonGroup = OrderButtonGroup;

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

  get index() {
    return this.args.index + 1;
  }
}
