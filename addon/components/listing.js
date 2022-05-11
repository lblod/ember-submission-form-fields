import Component from '@glimmer/component';
import { getSubFormsForNode } from '../utils/model-factory';
import { calculateTriplesDataForScope } from '@lblod/submission-form-helpers';

export default class ListingComponent extends Component {
  subForms = [];

  constructor() {
    super(...arguments);

    const newScope = calculateTriplesDataForScope(
      this.args.listing.rdflibScope,
      {
        store: this.args.formStore,
        formGrah: this.args.formGraph,
        sourceNode: this.args.sourceNode,
        sourceGraph: this.args.sourceGraph
      },
      true
    );
    //TODO: the created triples should probably be added.... it might go wild on loop
    for (const sourceNode of newScope.values) {
      //TODO: we need a way to order subforms?
      const subForms = getSubFormsForNode({
        store: this.args.formStore,
        graphs: this.args.graphs,
        node: this.args.listing.uri,
        sourceNode
      });
      this.subForms = [...this.subForms, ...subForms];
    }
  }
}
