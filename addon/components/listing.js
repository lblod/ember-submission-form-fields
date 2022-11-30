import { A } from '@ember/array';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  generatorsForNode,
  triplesForGenerator,
  triplesForScope,
} from '@lblod/submission-form-helpers';
import { getSubFormsForNode } from '../utils/model-factory';
import { next } from '@ember/runloop';
import ListingList from '@lblod/ember-submission-form-fields/components/listing/list';
import ListingTable from '@lblod/ember-submission-form-fields/components/listing/table';

export default class ListingComponent extends Component {
  @tracked subForms = A();
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

  get ListingDisplayMode() {
    return this.listing.isTable ? ListingTable : ListingList;
  }

  constructor() {
    super(...arguments);
    this.updateScope();
    //TODO: perhaps there might be a better solution; feel free to look.
    // What does this fix?
    // The infamous:
    //  'You attempted to update `subForms` on `ListingComponent`, but it had already been used previously in the same computation. '
    // Why is it triggered? this.subForms is tracked, is rendered before the method below (which has side effects, i.e. updates this.subForms) ran.
    next(this, () => {
      this.renderSubForms();
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

  updateScope() {
    this.scope = triplesForScope(this.listing.rdflibScope, {
      store: this.formStore,
      formGrah: this.graphs.formGraph,
      sourceNode: this.sourceNode,
      sourceGraph: this.graphs.sourceGraph,
    });
  }

  renderSubForms() {
    let subForms = [];

    //This is a simplified version of rendering the subforms. It misses the following:
    // - TODO: ordering of hasMany
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
    const deletes = this.subForms.filter(
      (rendered) =>
        !subForms.find((child) => child.sourceNode.equals(rendered.sourceNode))
    );

    // 3) remove the "unwanted" children
    if (deletes.length) {
      this.subForms.removeObjects(deletes);
    }

    // 4) create a new list to render, merging already (rendered) children, with new children.
    // We don't want to re-render components, to avoid flickering behaviour and state loss.
    const mergedChildren = A();

    for (const child of subForms) {
      const existingField = this.subForms.find((eField) =>
        eField.sourceNode.equals(child.sourceNode)
      );
      if (existingField) {
        mergedChildren.pushObject(existingField);
      } else {
        mergedChildren.pushObject(child);
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
