import Component from '@glimmer/component';
import {
  generatorsForNode,
  triplesForGenerator,
} from '@lblod/submission-form-helpers';
import {
  getRootNodeForm,
  getTopLevelSections,
  getTopLevelFields,
} from '../utils/model-factory';
import isLast from '@lblod/ember-submission-form-fields/-private/helpers/is-last';
import { A } from '@ember/array';
import { restartableTask } from 'ember-concurrency';
import Section from '@lblod/ember-submission-form-fields/models/section';
import Field from '@lblod/ember-submission-form-fields/models/field';
import { action } from '@ember/object';

export default class RdfForm extends Component {
  isLast = isLast;
  topLevelElements = A([]);

  constructor() {
    super(...arguments);

    this.setupRdfForm.perform();
  }

  setupRdfForm = restartableTask(async () => {
    this.topLevelElements = A([]);
    this.runGenerator({
      store: this.args.formStore,
      graphs: this.args.graphs,
      sourceNode: this.args.sourceNode,
    });

    const sections = getTopLevelSections({
      store: this.args.formStore,
      graphs: this.args.graphs,
      form: this.args.form,
    });
    this.topLevelElements.pushObjects(sections);

    const fields = getTopLevelFields({
      store: this.args.formStore,
      graphs: this.args.graphs,
    });
    this.topLevelElements.pushObjects(fields);
  });

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
      const dataset = triplesForGenerator(generators.initGenerators[0], {
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

  get topLevelModels() {
    return this.topLevelElements.sort((a, b) => a.order - b.order);
  }

  get sections() {
    return this.topLevelElements.filter((model) => this.isSectionModel(model));
  }

  @action
  isSectionModel(model) {
    return model instanceof Section;
  }

  @action
  isFieldModel(model) {
    return model instanceof Field;
  }
}
