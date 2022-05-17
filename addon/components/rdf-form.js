import Component from '@glimmer/component';
import {
  getTopLevelPropertyGroups,
  getTopLevelListings,
  getRootNodeForm
} from '../utils/model-factory';
import {
 generatorsForNode,
 triplesForGenerator
} from '@lblod/submission-form-helpers';

export default class RdfForm extends Component {
  propertyGroups = []; // NOTE don't think this needs to be an ember array as it will never change

  constructor() {
    super(...arguments);

    this.runGenerator({
      store: this.args.formStore,
      graphs: this.args.graphs,
      sourceNode: this.args.sourceNode
    });

    this.propertyGroups = getTopLevelPropertyGroups({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.form
    });
  }

  runGenerator({ store, graphs, sourceNode }) {
    const rootNode = getRootNodeForm({
      store, graphs
    });

    const generators = generatorsForNode(rootNode, { store, formGraph: graphs.formGraph } );

    if(generators.initGenerators.length) {
      const dataset = triplesForGenerator(generators.initGenerators[0].object,
                                          { store, formGraph: graphs.formGraph });

      store.addAll(this.rescopeGeneratedTriples(dataset, { sourceNode, graphs }));
    }
  }

  rescopeGeneratedTriples(dataset, options) {
    //TODO: only very basic re-scoping is supported currently
    // in the future, we'd like to go back to a form:Scope to allow a more flexible approach
    const { sourceNode, graphs } = options;
    const triples = dataset.triples.map(t => {
      let subject = t.subject;

      if(subject.equals(dataset.sourceNodes[0])) {
        subject = sourceNode;
      }

      return {
        subject: subject,
        predicate: t.predicate,
        object: t.object,
        graph: graphs.sourceGraph
      };
    });

    return triples;
  }
}
