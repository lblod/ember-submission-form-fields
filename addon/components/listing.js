import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  generatorsForNode,
  triplesForGenerator,
  triplesForScope,
  SHACL,
} from '@lblod/submission-form-helpers';
import { getSubFormsForNode } from '../utils/model-factory';
import { next } from '@ember/runloop';
import ListingList from '@lblod/ember-submission-form-fields/components/listing/list';
import ListingTable from '@lblod/ember-submission-form-fields/components/listing/table';

const ORDER = SHACL('order');
const DIRECTION = {
  UP: 'up',
  DOWN: 'down',
};

export default class ListingComponent extends Component {
  @tracked subForms = [];
  scope = null;

  get formStore() {
    return this.args.formStore;
  }

  get graphs() {
    return this.args.graphs;
  }

  get sourceNode() {
    return this.args.sourceNode;
  }

  get listing() {
    return this.args.listing;
  }

  get canAdd() {
    if (this.args.show) {
      return false;
    } else if (this.listing.canAdd) {
      if (this.listing.maxCount) {
        return this.subForms.length < this.listing.maxCount;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  get canRemove() {
    const hasMinimumItems = this.listing.minCount
      ? this.listing.minCount < this.subForms.length
      : true;

    return this.listing.canRemove && !this.args.show && hasMinimumItems;
  }

  get canChangeOrder() {
    return (
      this.listing.canChangeOrder && !this.args.show && this.subForms.length > 1
    );
  }

  get ListingDisplayMode() {
    return this.listing.isTable ? ListingTable : ListingList;
  }

  get highestOrderValue() {
    let highestOrderValue = 0;

    if (this.subForms.length) {
      let lastSubForm = this.subForms[this.subForms.length - 1];

      highestOrderValue =
        getOrder(
          lastSubForm.sourceNode,
          this.formStore,
          this.graphs.sourceGraph
        ) || 0;
    }

    return highestOrderValue;
  }

  get orderedSubForms() {
    return [...this.subForms].sort((subFormA, subFormB) => {
      return (
        getOrder(subFormA.sourceNode, this.formStore, this.graphs.sourceGraph) -
        getOrder(subFormB.sourceNode, this.formStore, this.graphs.sourceGraph)
      );
    });
  }

  constructor() {
    super(...arguments);
    this.updateScope();
    //TODO: perhaps there might be a better solution; feel free to look.
    // What does this fix?
    // The infamous:
    //  'You attempted to update `children` on `SubmissionFormPropertyGroupComponent`, but it had already been used previously in the same computation. '
    next(this, () => {
      this.loadSubForms();
    });
  }

  @action
  createEntry() {
    const dataset = this.runGenerator();
    const triplesToInsert = [
      ...this.attachHasManyNodes(dataset.sourceNodes),
      ...dataset.triples.map((t) => {
        return { ...t, graph: this.graphs.sourceGraph };
      }),
      {
        subject: dataset.sourceNodes[0], // We only support 1 source node
        predicate: ORDER,
        object: this.highestOrderValue + 1,
        graph: this.graphs.sourceGraph,
      },
    ];

    this.formStore.addAll(triplesToInsert);
    this.updateScope();
    this.renderSubForms();
  }

  @action
  removeEntry(node) {
    // TODO: this is a simplified version and will result in dangling triples
    //  - We need a proper spec in the model on how to define a delete pattern
    //  - We could be more aggressive (i.e. delete all ?s ?p ?o) but might risk deleting too much (and breaking the data)
    const triplesToRemove = [];
    const { sourceNode, pathElement } = this.sourceForHasManyConnection();
    if (!pathElement.inversePath) {
      triplesToRemove.push({
        subject: sourceNode,
        predicate: pathElement.path,
        object: node,
        graph: this.graphs.sourceGraph,
      });
    } else {
      triplesToRemove.push({
        subject: node,
        predicate: pathElement.inversePath,
        object: sourceNode,
        graph: this.graphs.sourceGraph,
      });
    }
    this.formStore.removeStatements(triplesToRemove);
    this.updateScope();
    this.renderSubForms();
  }

  @action moveUp(subForm) {
    this.changeItemOrder(subForm, DIRECTION.UP);
  }

  @action moveDown(subForm) {
    this.changeItemOrder(subForm, DIRECTION.DOWN);
  }

  changeItemOrder(subform, direction) {
    const orderedSubForms = this.orderedSubForms;
    const index = this.orderedSubForms.indexOf(subform);
    const shouldMoveUp = direction === DIRECTION.UP;

    if (
      (shouldMoveUp && index === 0) ||
      (!shouldMoveUp && index === orderedSubForms.length)
    ) {
      return;
    }

    const otherSubform = shouldMoveUp
      ? orderedSubForms.at(index - 1)
      : orderedSubForms.at(index + 1);

    const currentOrder = getOrder(
      subform.sourceNode,
      this.formStore,
      this.graphs.sourceGraph
    );
    const otherOrder = getOrder(
      otherSubform.sourceNode,
      this.formStore,
      this.graphs.sourceGraph
    );

    // TODO: Both removeStatements and addAll will trigger the observer system
    // We should add a new method to the forking store that can both add and remove statements
    // and only trigger a single observer callback.
    this.formStore.removeStatements([
      {
        subject: subform.sourceNode,
        predicate: ORDER,
        object: currentOrder,
        graph: this.graphs.sourceGraph,
      },
      {
        subject: otherSubform.sourceNode,
        predicate: ORDER,
        object: otherOrder,
        graph: this.graphs.sourceGraph,
      },
    ]);

    this.formStore.addAll([
      {
        subject: subform.sourceNode,
        predicate: ORDER,
        object: otherOrder,
        graph: this.graphs.sourceGraph,
      },
      {
        subject: otherSubform.sourceNode,
        predicate: ORDER,
        object: currentOrder,
        graph: this.graphs.sourceGraph,
      },
    ]);

    // eslint-disable-next-line no-self-assign
    this.subForms = this.subForms; // Force a rerender with the new ordering
  }

  updateScope() {
    this.scope = triplesForScope(this.listing.rdflibScope, {
      store: this.formStore,
      formGrah: this.graphs.formGraph,
      sourceNode: this.sourceNode,
      sourceGraph: this.graphs.sourceGraph,
    });
  }

  loadSubForms() {
    let subForms = [];

    for (const sourceNode of this.scope.values) {
      const subForm = getSubFormsForNode({
        store: this.formStore,
        graphs: this.graphs,
        node: this.listing.uri,
        sourceNode,
      })[0];

      if (subForm) subForms.push(subForm);
    }

    // We add sh:order triples if a subForm doesn't have this yet
    // We assume this only happens if we are editing a form that was saved before this order feature
    ensureOrderTriplesForExistingData({
      subForms,
      formStore: this.formStore,
      sourceGraph: this.graphs.sourceGraph,
    });

    this.subForms = subForms;

    if (this.listing.minCount && this.subForms.length < this.listing.minCount) {
      const amountMissing = this.listing.minCount - this.subForms.length;

      // TODO: without next an error is thrown because the `children` prop of a parent PropertyGroup component is modified somewhere in the chain.
      // We need to spend some time to untangle this observer update hell.
      next(this, () => {
        Array(amountMissing)
          .fill()
          .forEach(() => {
            this.createEntry();
          });
      });
    }
  }

  renderSubForms() {
    let subForms = [];
    let currentSubForms = this.subForms;

    //This is a simplified version of rendering the subforms. It misses the following:
    // - TODO: a listing might have multiple subforms; where different info can be respresented
    // - TODO: there is currently no specific 'create' form
    // Note further:
    // - The rendering procedure might be similar to property-group; but is not the same.
    //   Given that it might get even more complex; I think we need to wait before abstracting this away.
    for (const sourceNode of this.scope.values) {
      const subForm = getSubFormsForNode({
        store: this.formStore,
        graphs: this.graphs,
        node: this.listing.uri,
        sourceNode,
      })[0];

      if (subForm) subForms.push(subForm);
    }

    // 2) calculate to be removed
    const deletes = currentSubForms.filter(
      (rendered) =>
        !subForms.find((child) => child.sourceNode.equals(rendered.sourceNode))
    );

    // 3) remove the "unwanted" children
    if (deletes.length) {
      currentSubForms = currentSubForms.filter((subform) => {
        return !deletes.includes(subform);
      });
    }

    // 4) create a new list to render, merging already (rendered) children, with new children.
    // We don't want to re-render components, to avoid flickering behaviour and state loss.
    const mergedChildren = [];

    for (const child of subForms) {
      const existingField = currentSubForms.find((eField) =>
        eField.sourceNode.equals(child.sourceNode)
      );
      if (existingField) {
        mergedChildren.push(existingField);
      } else {
        mergedChildren.push(child);
      }
    }

    this.subForms = mergedChildren;
  }

  runGenerator() {
    const generators = generatorsForNode(this.listing.uri, {
      store: this.formStore,
      formGraph: this.graphs.formGraph,
    });

    let fullDataset = { sourceNodes: [], triples: [] };
    for (const generator of generators.createGenerators) {
      const dataset = triplesForGenerator(generator, {
        store: this.formStore,
        formGraph: this.graphs.formGraph,
      });

      fullDataset.sourceNodes = [
        ...fullDataset.sourceNodes,
        ...dataset.sourceNodes,
      ];
      fullDataset.triples = [...fullDataset.triples, ...dataset.triples];
    }

    return fullDataset;
  }

  attachHasManyNodes(nodes) {
    //TODO: probably this type of boilerplate should be residing elsewhere
    const allSourceNodes = [];
    const { sourceNode, pathElement } = this.sourceForHasManyConnection();
    if (pathElement.inversePath) {
      for (const targetNode of nodes) {
        allSourceNodes.push({
          subject: targetNode,
          predicate: pathElement.inversePath,
          object: sourceNode,
          graph: this.graphs.sourceGraph,
        });
      }
    } else {
      for (const targetNode of nodes) {
        allSourceNodes.push({
          subject: sourceNode,
          predicate: pathElement.path,
          object: targetNode,
          graph: this.graphs.sourceGraph,
        });
      }
    }
    return allSourceNodes;
  }

  sourceForHasManyConnection() {
    //It assumes >= 1 of ordered segment data.
    const lastSegementData = this.scope.orderedSegmentData.slice(-1)[0];

    //TODO: this assumes the source of the hasMany relation is singular.
    // However, it could be that multiple nodes on a path are the source of the hasMany
    // Let's not support this for now.
    const sourceData = { sourceNode: {}, ...lastSegementData };

    if (this.scope.orderedSegmentData.length == 1) {
      sourceData.sourceNode = this.sourceNode;
    } else {
      const penUltimatePathElement = this.scope.orderedSegmentData.slice(-2)[0];
      const values = penUltimatePathElement.values;
      if (values.length == 0) {
        throw `No penultimate hop found. It is not clear how we should support this.
               Try form:generator to prepare default data`;
      } else if (values.length > 1) {
        throw `Many source nodes not supported for a hasMany relation`;
      } else {
        sourceData.sourceNode = values[0];
      }
    }

    return sourceData;
  }
}

function ensureOrderTriplesForExistingData({
  subForms,
  formStore,
  sourceGraph,
}) {
  let shouldAddOrderTriples = subForms.some((subForm) => {
    return !hasOrder(subForm.sourceNode, formStore, sourceGraph);
  });

  if (shouldAddOrderTriples) {
    let orderTriples = subForms.map((subForm, index) => {
      return {
        subject: subForm.sourceNode,
        predicate: ORDER,
        object: index + 1,
        graph: sourceGraph,
      };
    });

    formStore.addAll(orderTriples);
  }
}

function hasOrder(subject, store, graph) {
  let maybeOrder = store.any(subject, ORDER, undefined, graph);

  return Boolean(maybeOrder);
}

function getOrder(subject, store, graph) {
  let order = store.any(subject, ORDER, undefined, graph);

  return parseInt(order.value);
}
