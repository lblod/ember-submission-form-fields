import Component from '@glimmer/component';
import {
  generatorsForNode,
  triplesForGenerator,
  triplesForLazyGenerator,
} from '@lblod/submission-form-helpers';
import { getRootNodeForm, getTopLevelSections } from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';

export default class RdfForm extends Component {
  sections = []; // NOTE don't think this needs to be an ember array as it will never change
  isLast = isLast;

  constructor() {
    super(...arguments);

    this.runGenerator({
      store: this.args.formStore,
      graphs: this.args.graphs,
      sourceNode: this.args.sourceNode,
    });

    this.sections = getTopLevelSections({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.form,
    });
  }

  runGenerator({ store, graphs, sourceNode }) {
    const rootNode = getRootNodeForm({
      store,
      graphs,
    });

    const generators = generatorsForNode(rootNode, {
      store,
      formGraph: graphs.formGraph,
    });

    if (generators.initGenerators.length) {
      let generatorFunction = triplesForGenerator;
      if (this.args.lazyGenerators) {
        generatorFunction = triplesForLazyGenerator;
      }
      const dataset = generatorFunction(generators.initGenerators[0], {
        store,
        sourceNode,
        formGraph: graphs.formGraph,
        sourceGraph: graphs.sourceGraph,
      });

      store.addAll(
        this.rescopeGeneratedTriples(dataset, { sourceNode, graphs })
      );
    }
  }

  rescopeGeneratedTriples(dataset, options) {
    //TODO: only very basic re-scoping is supported currently
    // in the future, we'd like to go back to a form:Scope to allow a more flexible approach
    const { sourceNode, graphs } = options;
    const triples = dataset.triples.map((t) => {
      let subject = t.subject;

      if (subject.equals(dataset.sourceNodes[0])) {
        subject = sourceNode;
      }

      return {
        subject: subject,
        predicate: t.predicate,
        object: t.object,
        graph: graphs.sourceGraph,
      };
    });

    return triples;
  }
}
