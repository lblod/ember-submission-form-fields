import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';
import Component from '@glimmer/component';
import {
    generatorsForNode,
    triplesForGenerator, triplesForScope
} from '@lblod/submission-form-helpers';
import { getRootNodeForm, getSubFormsForNode } from '../utils/model-factory';
import rdflib from 'browser-rdflib';

const SHACL = new rdflib.Namespace('http://www.w3.org/ns/shacl#');

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

  constructor() {
    super(...arguments);
    this.updateScope();
    this.renderSubForms();
  }

  @action
  addEntry() {
    const triples = this.runGenerator();
    this.formStore.addAll(triples);
    this.updateScope();
    this.renderSubForms();
  }

  updateScope() {
    this.scope = triplesForScope(
      this.listing.rdflibScope,
      {
        store: this.formStore,
        formGrah: this.graphs.formGraph,
        sourceNode: this.sourceNode,
        sourceGraph: this.graphs.sourceGraph
      }
    );
  }

  renderSubForms() {
    let subForms = [];

    for (const sourceNode of this.scope.values) {
      //TODO: we need a way to order subforms. And probably multiple ways
      const newSubForms = getSubFormsForNode({
        store: this.formStore,
        graphs: this.graphs,
        node: this.listing.uri,
        sourceNode
      });
      subForms = [ ...subForms, ...newSubForms ];
    }

    // 2) calculate to be removed
    const deletes = this.subForms.filter(
      (rendered) => !subForms.find((child) => child.sourceNode.equals(rendered.sourceNode) && child.uri.equals(rendered.uri))
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
    const generators = generatorsForNode(this.listing.uri,
                                         { store: this.formStore, formGraph: this.graphs.formGraph });

    let allTriples = [];
    for(const generator of generators.createGenerators) {
      const dataset = triplesForGenerator(generator,
                                          { store: this.formStore, formGraph: this.graphs.formGraph });

      const triples = this.attachGeneratedTriples(dataset);
      allTriples = [ ...allTriples, ...triples ];
    }

    return allTriples;
  }

  attachGeneratedTriples( dataset ) {
    //TODO: probably this type of boilerplate should be residing elsewhere
    const allTriples = dataset.triples.map(t => { return {...t, graph: this.graphs.sourceGraph }; });

    const path = this.formStore.any(this.listing.rdflibScope, SHACL("path"), undefined, this.graphs.formGraph);
    const { pathSegment, inverse }  = this.pathSegmentToConnect(path);
    if(inverse){
      for(const targetNode of dataset.sourceNodes) {
        allTriples.push({
          subject: targetNode,
          predicate: pathSegment,
          object: this.sourceNode,
          graph: this.graphs.sourceGraph
        });
      }
    }
    else {
      for(const targetNode of dataset.sourceNodes) {
        allTriples.push({
          subject: this.sourceNode,
          predicate: pathSegment,
          object: targetNode,
          graph: this.graphs.sourceGraph
        });
      }
    }
    return allTriples;
  }

  pathSegmentToConnect( path ) {
    if(path.termType === "Collection") {
      const firstHop = path.elements[0];
      if (firstHop.termType == "NamedNode") {
        return { pathSegment: firstHop };
      }
      else {
        const inversePath = this.formStore.any(firstHop, SHACL("inversePath"), undefined, this.graphs.formGraph);
        return { pathSegment: inversePath, inverse: true };
      }
    }
    else {
      return { pathSegment: path } ;
    }
  }
}
